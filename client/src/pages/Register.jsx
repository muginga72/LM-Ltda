// src/components/Register.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, Button, Container, Alert, Image, Row, Col } from "react-bootstrap";
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
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview("");
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const phoneIsValid = (p) => {
    if (!p) return false;
    return /^\+?[0-9]{7,15}$/.test(p.trim());
  };

  const validateAvatarFile = (file) => {
    if (!file) return { ok: true };
    if (!ALLOWED_TYPES.includes(file.type))
      return { ok: false, message: t("register.avatarInvalidType") };
    if (file.size > MAX_FILE_SIZE)
      return { ok: false, message: t("register.avatarTooLarge") };
    return { ok: true };
  };

  const handleAvatarChange = (e) => {
    setError("");
    const file = e.target.files?.[0] || null;
    if (!file) {
      setAvatarFile(null);
      return;
    }
    const v = validateAvatarFile(file);
    if (!v.ok) {
      setError(v.message);
      setAvatarFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setAvatarFile(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
        typeof contextRegister === "function"
          ? contextRegister
          : registerFallback;
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
      <Container style={{ maxWidth: 520, marginTop: 40 }}>
        <h2>{t("register.title")}</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSignup}>
          <Form.Group className="mb-3" controlId="registerFullName">
            <Form.Label>{t("register.name")}</Form.Label>
            <Form.Control
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("register.namePlaceholder")}
              autoComplete="name"
            />
          </Form.Group>

          <Row>
            <Col md={7}>
              <Form.Group className="mb-3" controlId="registerEmail">
                <Form.Label>{t("register.email")}</Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("register.emailPlaceholder") || ""}
                  autoComplete="email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="registerPhone">
                <Form.Label>{t("register.phone")}</Form.Label>
                <Form.Control
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+244 xxx xxx xxx"
                  isInvalid={phone !== "" && !phoneIsValid(phone)}
                  autoComplete="tel"
                />
                <Form.Control.Feedback type="invalid">
                  {t("register.invalidPhone")}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  {t("register.phoneHelp")}
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={5}>
              <Form.Group className="mb-3" controlId="registerAvatar">
                <Form.Label>{t("register.avatar")}</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
                <Form.Text className="text-muted">
                  {t("register.avatarHelp")}
                </Form.Text>

                {avatarPreview ? (
                  <div className="mt-2 d-flex align-items-center">
                    <Image
                      src={avatarPreview}
                      roundedCircle
                      width={72}
                      height={72}
                      style={{ objectFit: "cover", border: "1px solid #ddd" }}
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="ms-2"
                      onClick={handleRemoveAvatar}
                    >
                      {t("register.removeAvatar")}
                    </Button>
                  </div>
                ) : (
                  <div className="mt-2 text-muted small">
                    {t("register.avatarEmpty")}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>{t("register.password")}</Form.Label>
            <Form.Control
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("register.passwordPlaceholder") || ""}
              autoComplete="new-password"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerConfirmPassword">
            <Form.Label>{t("register.confirmPassword")}</Form.Label>
            <Form.Control
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("register.confirmPasswordPlaceholder") || ""}
              autoComplete="new-password"
            />
          </Form.Group>

          <Button type="submit" disabled={loading}>
            {loading ? t("register.registering") : t("register.registerButton")}
          </Button>
        </Form>
      </Container>

      <footer className="text-center py-3">
        <small>
          © {new Date().getFullYear()} LM-Ltd. {t("register.footer")}
        </small>
      </footer>
    </>
  );
}

export default Register;