// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { AuthContext } from "../contexts/AuthContext";
import "../i18n";

const LOGIN_PATH = "/api/auth/login";
const ME_PATH = "/api/auth/me";

function resolveApiBase(endpointProp) {
  const envBase =
    typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE
      ? process.env.REACT_APP_API_BASE
      : "";
  const baseFromEnv = (envBase || "").replace(/V$/, "");

  if (endpointProp) {
    try {
      return new URL(endpointProp).toString();
    } catch {
      try {
        if (typeof window !== "undefined" && window.location && window.location.origin) {
          return new URL(endpointProp, window.location.origin).toString();
        }
      } catch {
        return endpointProp;
      }
    }
  }

  if (baseFromEnv) return baseFromEnv.replace(/V$/, "");

  try {
    if (typeof window !== "undefined") {
      const runtime = window._ENV_ || null;
      if (runtime && runtime.API_BASE) return runtime.API_BASE.replace(/V$/, "");
    }
  } catch {}

  try {
    if (typeof window !== "undefined" && window.location && window.location.origin) {
      return window.location.origin;
    }
  } catch {}

  return "";
}

async function parseJsonSafe(res) {
  if (!res) return null;
  if (res.status === 204 || res.status === 304) return null;
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  try {
    const txt = await res.text();
    if (!txt) return null;
    try {
      return JSON.parse(txt);
    } catch {
      return { message: txt };
    }
  } catch {
    return null;
  }
}

async function loginFallback(emailArg, passwordArg, apiBaseOverride) {
  const base = resolveApiBase(apiBaseOverride);
  if (!base) throw new Error("API base missing");

  const loginUrl = `${base.replace(/V$/, "")}${LOGIN_PATH}`;
  const res = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: emailArg, password: passwordArg }),
  });

  if (res.status === 404) throw new Error(`404 ${loginUrl}`);
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    if (payload === null) throw new Error("no-body");
    throw new Error(payload?.message || payload?.error || `HTTP ${res.status}`);
  }
  return payload;
}

async function fetchCurrentUser(apiBaseOverride) {
  const base = resolveApiBase(apiBaseOverride);
  if (!base) return null;
  const meUrl = `${base.replace(/V$/, "")}${ME_PATH}`;
  const res = await fetch(meUrl, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  });
  if (res.status === 404) return null;
  const payload = await parseJsonSafe(res);
  if (!res.ok) return null;
  return payload;
}

/* Login component */
function Login({ apiBaseProp, apiBase }) {
  const { t } = useTranslation();
  const authContext = useContext(AuthContext) || {};
  const contextLogin = authContext.login || null;
  const contextSetUser = authContext.setUser || null;
  const contextSetAuth = authContext.setAuth || null;
  const contextUser = authContext.user || null;
  const contextToken = authContext.token || null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Change password modal state
  const [showChangeModal, setShowChangeModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect
    const user = contextUser;
    if (user && user.role) {
      const role = user.role;
      if (role === "admin") navigate("/admin");
      else navigate("/services");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loginFn =
        typeof contextLogin === "function"
          ? contextLogin
          : (e, p) => loginFallback(e, p, apiBaseProp || apiBase);
      const result = await loginFn(email, password);

      // result may contain { user, token } or user directly
      let user = result?.user ?? result ?? null;
      let token = result?.token ?? result?.accessToken ?? result?.access_token ?? null;

      if (!user) {
        const me = await fetchCurrentUser(apiBaseProp || apiBase);
        if (me) user = me.user || me;
      }

      if (token) {
        try {
          localStorage.setItem("auth_token", token);
        } catch {}
      }

      if (typeof contextSetUser === "function" && user) contextSetUser(user);
      if (typeof contextSetAuth === "function") contextSetAuth({ user, token });

      const role = user?.role ?? result?.role;
      if (role === "admin") navigate("/admin");
      else navigate("/services");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Login error:", err);
      let msg = t("login.failed") || "Login failed";
      if (err?.message === "API base missing") msg = t("error.apiBaseMissing") || "API base missing";
      else if (String(err?.message).includes("404"))
        msg = t("error.endpoint404", { url: err.message }) || `Endpoint not found: ${err.message}`;
      else if (err?.message === "no-body") msg = t("error.noBody") || "No response body";
      else if (err?.message) msg = err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Determine userId and token to pass to modal (if available)
  const userId = contextUser?._id ?? contextUser?.id ?? null;
  const token =
    contextToken ??
    (function () {
      try {
        return localStorage.getItem("auth_token");
      } catch {
        return null;
      }
    })();

  return (
    <>
      <Container style={{ maxWidth: 700, marginTop: 40 }}>
        <Card className="p-4">
          <h2 className="mb-3">{t("login.title") || "Login"}</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>{t("login.email") || "Email"}</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.placeholder.email") || "you@example.com"}
                required
                autoComplete="email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>{t("login.password") || "Password"}</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("login.placeholder.password") || "Password"}
                required
                autoComplete="current-password"
              />
            </Form.Group>

            <Button type="submit" className="mb-3" disabled={loading}>
              {loading ? (t("login.logging") || "Logging in...") : (t("login.button") || "Login")}
            </Button>

            {/* Link below login button to open change-password modal 
            <div className="mt-2">
              <a
                href="#change-password"
                onClick={(e) => {
                  e.preventDefault();
                  setShowChangeModal(true);
                }}
                style={{ fontSize: "0.9rem", display: "inline-block" }}
              >
                Change password
              </a>
            </div>*/}
          </Form>

          {/* The modal can be opened even if user is not logged in; it will attempt to use token/localStorage */}
          <ChangePasswordModal
            show={showChangeModal}
            onHide={() => setShowChangeModal(false)}
            apiBase={apiBaseProp || apiBase}
            userId={userId}
            token={token}
          />
        </Card>
      </Container>

      <hr />
      <footer className="text-center py-2">
        <small>{t("app.copyright", { year: new Date().getFullYear() }) || `© ${new Date().getFullYear()}`}</small>
      </footer>
    </>
  );
}

export default Login;