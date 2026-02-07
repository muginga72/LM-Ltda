// src/components/ProfileModal.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Modal, Row, Col, Image, Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

function resolveApiBaseCandidate(candidate) {
  if (!candidate) return "";
  try {
    const u = new URL(candidate, typeof window !== "undefined" ? window.location.origin : undefined);
    if (/^https?:\/\//i.test(candidate)) return u.origin;
    if (candidate.startsWith("/")) return "";
    return String(candidate).replace(/\/+$/, "");
  } catch {
    return String(candidate).replace(/\/+$/, "");
  }
}

function resolveApiBase(override, propApiBase) {
  if (override) return resolveApiBaseCandidate(override);
  if (propApiBase) return resolveApiBaseCandidate(propApiBase);
  try {
    if (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE) {
      const candidate = String(process.env.REACT_APP_API_BASE).trim();
      if (candidate) return resolveApiBaseCandidate(candidate);
    }
  } catch {}
  try {
    if (typeof window !== "undefined" && window._ENV_ && window._ENV_.API_BASE) {
      const candidate = String(window._ENV_.API_BASE).trim();
      if (candidate) return resolveApiBaseCandidate(candidate);
    }
  } catch {}
  // fallback to same-origin (use relative paths)
  return "";
}

export default function ProfileModal({ show, onHide, apiBase = "" }) {
  const { t } = useTranslation();
  const auth = useContext(AuthContext) || {};
  const contextUser = auth.user || null;

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/avatar.png");
  const [avatarFile, setAvatarFile] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const getToken = () => {
    if (auth && auth.token) return auth.token;
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) return parsed.token ?? parsed.access_token ?? parsed.accessToken ?? null;
      }
    } catch {}
    return localStorage.getItem("auth_token") ?? localStorage.getItem("token") ?? null;
  };

  const toAbsoluteAvatarUrl = (maybeUrl, baseOverride) => {
    if (!maybeUrl) return "/avatar.png";
    try {
      // If absolute, this will succeed
      return new URL(maybeUrl, typeof window !== "undefined" ? window.location.origin : undefined).toString();
    } catch {
      try {
        const base = resolveApiBase(baseOverride, apiBase) || (typeof window !== "undefined" ? window.location.origin : "");
        return new URL(maybeUrl, base).toString();
      } catch {
        return maybeUrl;
      }
    }
  };

  const populateFromObject = (userObj) => {
    if (!mountedRef.current || !userObj) return;
    setFullName(userObj.fullName ?? userObj.userName ?? userObj.name ?? "");
    setEmail(userObj.email ?? "");
    setPhone(userObj.phone ?? "");
    const avatarCandidate = userObj.avatarUrl ?? userObj.avatar ?? userObj.image ?? "";
    setAvatarUrl(toAbsoluteAvatarUrl(avatarCandidate, null));
    setAvatarFile(null);
    setMessage("");
    setError("");
  };

  useEffect(() => {
    if (!show) return;

    const controller = new AbortController();
    let cancelled = false;

    const fetchProfile = async () => {
      if (!mountedRef.current) return;
      setLoadingProfile(true);
      setError("");
      try {
        // If we already have a context user, populate immediately for snappy UI
        if (contextUser) populateFromObject(contextUser);

        const base = resolveApiBase(null, apiBase);
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const withCredentials = true;

        // Try /api/users/profile first
        try {
          const url = `${base.replace(/\/+$/, "")}/api/users/profile`;
          const res = await axios.get(url, { headers, withCredentials, signal: controller.signal });
          if (res?.status === 200) {
            const returned = res?.data;
            const user = returned?.user ?? returned ?? null;
            if (user) {
              populateFromObject(user);
              return;
            }
          }
        } catch (err) {
          if (axios.isCancel(err)) return;
          // ignore and try next endpoint
        }

        // Try /api/auth/me
        try {
          const url2 = `${base.replace(/\/+$/, "")}/api/auth/me`;
          const res2 = await axios.get(url2, { headers, withCredentials, signal: controller.signal });
          if (res2?.status === 200) {
            const returned = res2?.data;
            const user = returned?.user ?? returned ?? null;
            if (user) {
              populateFromObject(user);
              return;
            }
          }
        } catch (err) {
          if (axios.isCancel(err)) return;
          // ignore and fallback to localStorage
        }

        // Fallback to localStorage
        try {
          const storedRaw = localStorage.getItem("user");
          const stored = storedRaw ? JSON.parse(storedRaw) : null;
          if (stored && typeof stored === "object") {
            populateFromObject(stored);
            return;
          }
        } catch {}

        if (!cancelled && mountedRef.current) {
          setError(t("Failed to load profile") || "Failed to load profile");
        }
      } catch (err) {
        if (!cancelled && mountedRef.current) {
          // eslint-disable-next-line no-console
          console.error("Failed to fetch profile:", err);
          setError(t("Failed to load profile") || "Failed to load profile");
        }
      } finally {
        if (!cancelled && mountedRef.current) setLoadingProfile(false);
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, apiBase, contextUser]);

  const handleAvatarChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setAvatarFile(f);
      const url = URL.createObjectURL(f);
      setAvatarUrl(url);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const base = resolveApiBase(null, apiBase);
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const withCredentials = true;

      // If avatarFile exists, upload via multipart/form-data
      if (avatarFile) {
        const form = new FormData();
        form.append("avatar", avatarFile);
        form.append("fullName", fullName);
        form.append("email", email);
        form.append("phone", phone);
        const url = `${base.replace(/\/+$/, "")}/api/users/profile`;
        const res = await axios.put(url, form, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
          withCredentials,
        });
        const returned = res?.data ?? {};
        const user = returned?.user ?? returned ?? null;
        if (user) populateFromObject(user);
      } else {
        // simple JSON update
        const url = `${base.replace(/\/+$/, "")}/api/users/profile`;
        const payload = { fullName, email, phone, avatar: avatarUrl };
        const res = await axios.put(url, payload, { headers, withCredentials });
        const returned = res?.data ?? {};
        const user = returned?.user ?? returned ?? null;
        if (user) populateFromObject(user);
      }

      setMessage(t("Profile updated successfully!") || "Profile updated successfully!");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to save profile:", err);
      setError(err?.response?.data?.message ?? "Failed to save profile");
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("Profile") || "Profile"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="p-3">
          <Row className="align-items-center">
            <Col xs={4} className="text-center">
              <Image
                src={avatarUrl || "/avatar.png"}
                roundedCircle
                width={120}
                height={120}
                alt={t("User avatar") || "User avatar"}
                style={{ objectFit: "cover", boxShadow: "0 0 8px rgba(0,0,0,0.12)" }}
                onError={() => setAvatarUrl("/avatar.png")}
              />
              <div className="mt-2">
                <Form.Group controlId="avatarFile">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    size="sm"
                  />
                </Form.Group>
              </div>
            </Col>
            <Col xs={8}>
              {loadingProfile && (
                <div className="mb-2">
                  <Spinner animation="border" size="sm" /> {t("Loading profile...") || "Loading profile..."}
                </div>
              )}
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-2">
                  <Form.Label>{t("Name") || "Name"}</Form.Label>
                  <Form.Control type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>{t("Email") || "Email"}</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>{t("Phone") || "Phone"}</Form.Label>
                  <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Form.Group>
                <div className="d-flex gap-2 mt-3">
                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" /> {t("Saving...") || "Saving..."}
                      </>
                    ) : (
                      t("Save Changes") || "Save Changes"
                    )}
                  </Button>
                  <Button variant="secondary" onClick={onHide}>
                    {t("Close") || "Close"}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card>
      </Modal.Body>
    </Modal>
  );
}

ProfileModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  apiBase: PropTypes.string,
};

ProfileModal.defaultProps = {
  show: false,
  onHide: () => {},
  apiBase: "",
};