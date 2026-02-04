// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { AuthContext } from "../contexts/AuthContext";
import "../i18n";

const LOGIN_PATH = "/api/auth/login";
const ME_PATH = "/api/auth/me";

function normalizeApiBase(s) {
  if (!s || typeof s !== "string") return "";
  const out = s.trim();
  try {
    const u = new URL(
      out,
      typeof window !== "undefined" ? window.location.origin : undefined,
    );
    if (/^https?:\/\//i.test(out)) return u.origin;
    if (out.startsWith("/")) return "";
    return out.replace(/V+$/, "");
  } catch {
    return out.replace(/V+$/, "");
  }
}

function resolveApiBase(apiBaseProp) {
  if (apiBaseProp) return normalizeApiBase(apiBaseProp);
  try {
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.REACT_APP_API_BASE
    ) {
      const candidate = process.env.REACT_APP_API_BASE;
      if (candidate) return normalizeApiBase(candidate);
    }
  } catch {}
  try {
    if (
      typeof window !== "undefined" &&
      window._ENV_ &&
      window._ENV_.API_BASE
    ) {
      return normalizeApiBase(window._ENV_.API_BASE);
    }
  } catch {}
  return "";
}

function buildUrl(base, path) {
  if (!path) return base || "";
  if (!base) return path.startsWith("/") ? path : `/${path}`;
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;
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
  const loginUrl = buildUrl(base, LOGIN_PATH);
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
  const meUrl = buildUrl(base, ME_PATH);
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

function Login({ apiBaseProp, apiBase }) {
  const { t } = useTranslation();
  const authContext = useContext(AuthContext) || {};
  const contextLogin =
    typeof authContext.login === "function" ? authContext.login : null;
  const contextSetUser =
    typeof authContext.setUser === "function" ? authContext.setUser : null;
  const contextSetAuth =
    typeof authContext.setAuth === "function" ? authContext.setAuth : null;
  const contextUser = authContext.user || null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = contextUser;
    if (user && user.role) {
      const role = user.role;
      if (role === "admin") navigate("/admin");
      else navigate("/services");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextUser, navigate]);

  const getStoredToken = () => {
    try {
      const t1 = localStorage.getItem("auth_token");
      if (t1) return t1;
      const t2 = localStorage.getItem("token");
      if (t2) return t2;
      const raw = localStorage.getItem("user");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          return (
            parsed?.token ?? parsed?.accessToken ?? parsed?.access_token ?? null
          );
        } catch {
          return null;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const apiBaseToUse = apiBaseProp ?? apiBase ?? undefined;
      const loginFn =
        typeof contextLogin === "function"
          ? contextLogin
          : (em, pw) => loginFallback(em, pw, apiBaseToUse);
      const result = await loginFn(email, password);

      let user = result?.user ?? result ?? null;
      let token =
        result?.token ?? result?.accessToken ?? result?.access_token ?? null;

      if (!user) {
        const me = await fetchCurrentUser(apiBaseToUse);
        if (me) user = me.user ?? me;
      }

      if (!user && token) {
        try {
          localStorage.setItem("auth_token", token);
        } catch {}
        const me = await fetchCurrentUser(apiBaseToUse);
        if (me) user = me.user ?? me;
      }

      if (!user && !token) {
        throw new Error(t("Login failed") || "Login failed");
      }

      if (token) {
        try {
          localStorage.setItem("auth_token", token);
        } catch {}
      } else {
        const stored = getStoredToken();
        if (stored) token = stored;
      }

      try {
        const toStore = {
          ...(typeof user === "object" ? user : {}),
          token: token || undefined,
        };
        localStorage.setItem("user", JSON.stringify(toStore));
      } catch {}

      if (contextSetUser) contextSetUser(user);
      if (contextSetAuth) contextSetAuth({ user, token: token || null });

      if (user && user.role === "admin") navigate("/admin");
      else navigate("/services");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Login error:", err);
      setError(
        err?.message || String(err) || t("Login failed") || "Login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <h3 className="mb-3">Login</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>{t("Email") || "Email"}</Form.Label>
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
                <Form.Label>{t("Password") || "Password"}</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.placeholder.password") || "Password"}
                  required
                  autoComplete="current-password"
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : t("Login") || "Login"}
                </Button>
                <Button variant="link" onClick={() => setShowChangeModal(true)}>
                  {t("Change Password") || "Change Password"}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>

      <ChangePasswordModal
        show={showChangeModal}
        onHide={() => setShowChangeModal(false)}
      />
    </Container>
  );
}

export default Login;