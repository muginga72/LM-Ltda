// src/components/Register.jsx
import React, { useState, useContext } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

// Build-time env
const ENV_BASE = process.env.REACT_APP_API_BASE || "";
const BASE = ENV_BASE.replace(/\/$/, "");
const DEFAULT_REGISTER_PATH = "/api/auth/register";

function resolveApiBase(endpointProp) {
  if (endpointProp) {
    try {
      return new URL(endpointProp).toString();
    } catch {
      try {
        return new URL(endpointProp, window.location.origin).toString();
      } catch {
        return endpointProp;
      }
    }
  }

  if (BASE) {
    try {
      return new URL(`${BASE}${DEFAULT_REGISTER_PATH}`).origin;
    } catch {
      return BASE;
    }
  }

  try {
    const runtime = typeof window !== "undefined" ? window.__ENV__ : null;
    if (runtime && runtime.API_BASE) {
      return runtime.API_BASE.replace(/\/$/, "");
    }
  } catch {}

  try {
    return window.location.origin;
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

function Register({ apiBaseProp }) {
  const { t } = useTranslation();
  const { register: contextRegister } = useContext(AuthContext) || {};
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerFallback = async ({ fullName, email, password }) => {
    const base = resolveApiBase(apiBaseProp);
    if (!base) {
      throw new Error(t("register.apiBaseMissing"));
    }

    const url = `${base.replace(/\/$/, "")}${DEFAULT_REGISTER_PATH}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({ fullName, email, password }),
    });

    if (res.status === 404) {
      throw new Error(t("register.endpointNotFound", { url }));
    }

    const payload = await parseJsonSafe(res);

    if (!res.ok) {
      const msg =
        (payload && (payload.message || payload.error || payload.msg)) ||
        `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return payload;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("register.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      const registerFn =
        typeof contextRegister === "function" ? contextRegister : registerFallback;
      await registerFn({ fullName, email, password });

      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err?.message || t("register.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container style={{ maxWidth: 420, marginTop: 50 }}>
        <h2>{t("register.title")}</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSignup}>
          <Form.Group className="mb-3" controlId="registerFullName">
            <Form.Label>{t("register.name")}</Form.Label>
            <Form.Control
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>{t("register.email")}</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@example.com"
              required
              autoComplete="email"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>{t("register.password")}</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerConfirmPassword">
            <Form.Label>{t("register.confirmPassword")}</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </Form.Group>

          <Button type="submit" className="mb-3" disabled={loading}>
            {loading ? t("register.registering") : t("register.registerButton")}
          </Button>
        </Form>
      </Container>

      <hr />
      <footer className="text-center py-2">
        <small>
          &copy; {new Date().getFullYear()} LM Ltd. {t("register.footer")}
        </small>
      </footer>
    </>
  );
}

export default Register;