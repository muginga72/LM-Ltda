// src/components/AdminLogin.jsx
import React, { useState, useContext } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const DEFAULT_LOGIN_PATH = "/api/auth/login";

function resolveApiBase(endpointProp) {
  if (endpointProp) {
    try {
      return new URL(endpointProp).toString().replace(/\/$/, "");
    } catch {
      try {
        return new URL(endpointProp, window.location.origin).toString().replace(/\/$/, "");
      } catch {
        return endpointProp.replace(/\/$/, "");
      }
    }
  }

  const ENV_BASE = process.env.REACT_APP_API_BASE || "";
  if (ENV_BASE) {
    try {
      return new URL(ENV_BASE).toString().replace(/\/$/, "");
    } catch {
      return ENV_BASE.replace(/\/$/, "");
    }
  }

  try {
    const runtime = typeof window !== "undefined" ? window.__ENV__ : null;
    if (runtime && runtime.API_BASE) {
      return runtime.API_BASE.replace(/\/$/, "");
    }
  } catch {}

  try {
    return window.location.origin.replace(/\/$/, "");
  } catch {
    return "";
  }
}

async function parseJsonSafe(res) {
  if (!res) return null;
  if (res.status === 204 || res.status === 304) return null;
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      // fall through to text parse
    }
  }
  try {
    const txt = await res.text();
    if (!txt) return null;
    try {
      return JSON.parse(txt);
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

async function loginFallback({ email, password, apiBase }) {
  const base = apiBase || resolveApiBase();
  if (!base) {
    throw new Error(
      "API base URL not configured. Set REACT_APP_API_BASE at build time or inject window.__ENV__.API_BASE at runtime."
    );
  }

  const url = `${base}${DEFAULT_LOGIN_PATH.startsWith("/") ? "" : "/"}${DEFAULT_LOGIN_PATH}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ email, password }),
  });

  const payload = await parseJsonSafe(res);

  if (!res.ok) {
    const msg = (payload && (payload.message || payload.error || payload.msg)) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  if (payload && (payload.token || payload.accessToken)) {
    const token = payload.token || payload.accessToken;
    try {
      localStorage.setItem("token", token);
    } catch (e) {
      // ignore storage errors
    }

    if (payload.user) {
      return { user: payload.user, token };
    }

    try {
      const meRes = await fetch(`${base}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        credentials: "same-origin",
      });
      const mePayload = await parseJsonSafe(meRes);
      if (meRes.ok && mePayload) {
        return { user: mePayload, token };
      }
    } catch (e) {
      // ignore and fall through
    }

    return { user: null, token };
  }

  if (payload && (payload.user || payload.role || payload.email)) {
    return { user: payload.user || payload, token: null };
  }

  return { user: null, token: null };
}

function AdminLogin({ apiBaseProp }) {
  const auth = useContext(AuthContext) || {};
  const contextLogin = auth.login;
  const contextSetAuth = auth.setAuth; // optional setter if provided
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;

      if (typeof contextLogin === "function") {
        try {
          result = await contextLogin(email, password);
        } catch (ctxErr) {
          console.warn("AuthContext.login failed, falling back to direct API call.", ctxErr);
          result = await loginFallback({ email, password, apiBase: apiBaseProp });
        }
      } else {
        result = await loginFallback({ email, password, apiBase: apiBaseProp });
      }

      const user = result && (result.user || result);
      const token = result && result.token;

      if (typeof contextSetAuth === "function") {
        try {
          contextSetAuth({ user, token });
        } catch (e) {
          // ignore setter errors
        }
      }

      let resolvedUser = user;
      if (!resolvedUser && token) {
        try {
          const base = apiBaseProp || resolveApiBase();
          const meRes = await fetch(`${base}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            credentials: "same-origin",
          });
          const mePayload = await parseJsonSafe(meRes);
          if (meRes.ok && mePayload) resolvedUser = mePayload;
        } catch {
          // ignore
        }
      }

      if (!resolvedUser) {
        setError("Login succeeded but user information could not be retrieved.");
        try {
          localStorage.removeItem("token");
        } catch {}
        setLoading(false);
        return;
      }

      if (resolvedUser.role !== "admin") {
        setError("Access denied: Admins only");
        try {
          localStorage.removeItem("token");
        } catch {}
        setLoading(false);
        return;
      }

      nav("/admin");
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err?.message ||
        (err?.response && (err.response.data?.message || err.response.data?.error)) ||
        "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container style={{ maxWidth: 420, marginTop: 50 }}>
        <h2>Admin</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="adminEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@lm-ltd.com"
              required
              autoComplete="username"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="adminPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </Form.Group>

          <Button type="submit" className="mb-3" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                Signing in...
              </>
            ) : (
              "Login as Admin"
            )}
          </Button>
        </Form>
      </Container>

      <hr />
      <footer className="text-center py-2">
        <small>
          &copy; {new Date().getFullYear()} LM-Ltd Services. All rights reserved.
        </small>
      </footer>
    </>
  );
}

export default AdminLogin;