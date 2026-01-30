// src/components/ProfileModal.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Modal, Row, Col, Image, Form, Button, Card, Spinner } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

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

  // Resolve API base robustly
  const resolveApiBase = (override) => {
    const base = override || apiBase || "";
    if (!base && typeof window !== "undefined") return window.location.origin;
    try {
      return new URL(base).toString();
    } catch {
      return base;
    }
  };

  // Convert server avatar path to absolute URL if needed
  const toAbsoluteAvatarUrl = (maybeUrl) => {
    if (!maybeUrl) return "/avatar.png";
    try {
      // If it's already absolute, URL constructor will succeed
      return new URL(maybeUrl).toString();
    } catch {
      // If relative path (e.g., /uploads/avatars/xxx.jpg), resolve against origin or apiBase
      try {
        const base = resolveApiBase();
        return new URL(maybeUrl, base).toString();
      } catch {
        return maybeUrl;
      }
    }
  };

  // Try to fetch profile from multiple endpoints, fallback to localStorage
  useEffect(() => {
    if (!show) return;

    let cancelled = false;
    const controller = new AbortController();

    const getToken = () => {
      if (auth.token) return auth.token;
      try {
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        return stored?.token || localStorage.getItem("auth_token") || null;
      } catch {
        return localStorage.getItem("auth_token") || null;
      }
    };

    const populateFromObject = (userObj) => {
      if (!mountedRef.current || cancelled) return;
      setFullName(userObj.fullName || userObj.userName || "");
      setEmail(userObj.email || "");
      setPhone(userObj.phone || "");
      setAvatarUrl(toAbsoluteAvatarUrl(userObj.avatarUrl ?? userObj.avatar ?? "") || "/avatar.png");
      setAvatarFile(null);
      setMessage("");
      setError("");
    };

    const fetchProfile = async () => {
      setLoadingProfile(true);
      setError("");
      try {
        // If we already have a context user, populate immediately (optimistic)
        if (contextUser) populateFromObject(contextUser);

        const base = resolveApiBase();
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const withCredentials = token ? false : true;

        // Try /api/users/profile (GET)
        try {
          const url = `${base.replace(/\/$/, "")}/api/users/profile`;
          const res = await axios.get(url, {
            headers,
            withCredentials,
            signal: controller.signal,
          });
          if (res?.status === 200) {
            const returned = res?.data;
            const user = returned?.user ?? returned ?? null;
            if (user) {
              populateFromObject(user);
              return;
            }
          }
        } catch (err) {
          // ignore and try next endpoint unless it's a non-recoverable error
          if (axios.isCancel(err)) return;
        }

        // Try /api/auth/me
        try {
          const url2 = `${base.replace(/\/$/, "")}/api/auth/me`;
          const res2 = await axios.get(url2, {
            headers,
            withCredentials,
            signal: controller.signal,
          });
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
        }

        // Fallback to localStorage user
        try {
          const storedRaw = localStorage.getItem("user");
          const stored = storedRaw ? JSON.parse(storedRaw) : null;
          if (stored && typeof stored === "object") {
            populateFromObject(stored);
            return;
          }
        } catch {
          // ignore
        }

        // If we reach here, nothing worked
        if (!cancelled && mountedRef.current) {
          setError(t("Failed to load profile") || "Failed to load profile");
        }
      } catch (err) {
        if (!cancelled && mountedRef.current) {
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
  }, [show]);

  // File input change handler: preview and store file
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(t("Please select a valid image file") || "Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t("Image too large. Max 5MB.") || "Image too large. Max 5MB.");
      return;
    }

    setError("");
    setAvatarFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  // Save handler: sends FormData if file present, otherwise JSON
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const base = resolveApiBase();
      const url = `${base.replace(/\/$/, "")}/api/users/profile`;

      // token handling
      let token = auth.token || null;
      if (!token) {
        try {
          const stored = JSON.parse(localStorage.getItem("user") || "{}");
          token = stored?.token || localStorage.getItem("auth_token") || null;
        } catch {
          token = localStorage.getItem("auth_token") || null;
        }
      }

      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      let res;
      if (avatarFile) {
        const form = new FormData();
        form.append("fullName", fullName || "");
        form.append("email", email || "");
        form.append("phone", phone || "");
        form.append("avatar", avatarFile);

        res = await axios.put(url, form, {
          headers,
          withCredentials: token ? false : true,
        });
      } else {
        const payload = { fullName, email, phone };
        res = await axios.put(url, payload, {
          headers: { ...headers, "Content-Type": "application/json" },
          withCredentials: token ? false : true,
        });
      }

      const returned = res?.data;
      const updatedUser = returned?.user ?? returned ?? null;
      if (!updatedUser) {
        throw new Error(t("Unexpected server response") || "Unexpected server response");
      }

      const resolvedAvatar = toAbsoluteAvatarUrl(updatedUser.avatarUrl ?? updatedUser.avatar ?? "");

      setFullName(updatedUser.fullName || updatedUser.userName || "");
      setEmail(updatedUser.email || "");
      setPhone(updatedUser.phone || "");
      setAvatarUrl(resolvedAvatar || "/avatar.png");
      setAvatarFile(null);

      if (typeof auth.setUser === "function") {
        try {
          auth.setUser(updatedUser);
        } catch {
          // ignore
        }
      }

      // Merge into localStorage.user safely and preserve token
      try {
        const storedRaw = localStorage.getItem("user");
        const stored = storedRaw ? JSON.parse(storedRaw) : {};
        const merged = { ...stored, ...(typeof updatedUser === "object" ? updatedUser : {}) };
        if (stored?.token && !merged?.token) merged.token = stored.token;
        localStorage.setItem("user", JSON.stringify(merged));
      } catch {
        // ignore localStorage errors
      }

      setMessage(t("Profile updated successfully!") || "Profile updated successfully!");
    } catch (err) {
      console.error("Profile save error:", err);
      const serverMessage = err?.response?.data?.message ?? err?.response?.data?.error;
      const msg = serverMessage || err.message || t("Failed to update profile") || "Failed to update profile";
      setError(msg);
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  };

  // If avatar image fails to load (broken URL), fallback to placeholder
  const handleAvatarError = () => {
    setAvatarUrl("/avatar.png");
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t("Your Profile") || "Your Profile"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Card className="p-3">
          <Row className="align-items-center">
            <Col md={4} className="text-center">
              <div style={{ position: "relative", display: "inline-block" }}>
                {loadingProfile ? (
                  <div style={{ width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <Image
                    src={avatarUrl}
                    roundedCircle
                    width="120"
                    height="120"
                    alt={t("Your Profile") || "Your Profile"}
                    onError={handleAvatarError}
                    style={{ objectFit: "cover", boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}
                  />
                )}

                <div style={{ marginTop: 10 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <Button size="sm" variant="outline-primary" onClick={triggerFileSelect} disabled={loadingProfile || saving}>
                    {t("Upload picture") || "Upload picture"}
                  </Button>
                </div>
              </div>
            </Col>

            <Col md={8}>
              {message && <p className="text-success">{message}</p>}
              {error && <p className="text-danger">{error}</p>}

              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3" controlId="profileFullName">
                  <Form.Label>{t("Fullname") || "Fullname"}</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("Fullname") || "Fullname"}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="profileEmail">
                  <Form.Label>{t("Email") || "Email"}</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("Email") || "Email"}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="profilePhone">
                  <Form.Label>{t("Phone") || "Phone"}</Form.Label>
                  <Form.Control
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 555 5555"
                  />
                </Form.Group>

                <div className="d-flex gap-3">
                  <Button variant="primary" type="submit" disabled={saving || loadingProfile}>
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" /> {t("Saving...") || "Saving..."}
                      </>
                    ) : (
                      t("Save Changes") || "Save Changes"
                    )}
                  </Button>
                  <Button variant="outline-secondary" onClick={onHide} disabled={saving || loadingProfile}>
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