// src/pages/Profile.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Image, Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";

function resolveApiBase() {
  try {
    if (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE) {
      const candidate = String(process.env.REACT_APP_API_BASE).trim();
      if (candidate) {
        try {
          const u = new URL(candidate, typeof window !== "undefined" ? window.location.origin : undefined);
          if (/^https?:\/\//i.test(candidate)) return u.origin;
          if (candidate.startsWith("/")) return "";
          return candidate.replace(/\/+$/, "");
        } catch {
          return candidate.replace(/\/+$/, "");
        }
      }
    }
  } catch {}
  try {
    if (typeof window !== "undefined" && window._ENV_ && window._ENV_.API_BASE) {
      const candidate = String(window._ENV_.API_BASE).trim();
      if (candidate) {
        try {
          const u = new URL(candidate, window.location.origin);
          if (/^https?:\/\//i.test(candidate)) return u.origin;
          if (candidate.startsWith("/")) return "";
          return candidate.replace(/\/+$/, "");
        } catch {
          return candidate.replace(/\/+$/, "");
        }
      }
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

export default function Profile() {
  const auth = useContext(AuthContext) || {};
  const contextUser = auth.user ?? null;
  const setContextUser = typeof auth.setUser === "function" ? auth.setUser : null;
  const setContextAuth = typeof auth.setAuth === "function" ? auth.setAuth : null;

  const [user, setUser] = useState(contextUser);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "/images/avatar.png");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const API_BASE = resolveApiBase();

  const axiosInstance = axios.create({
    baseURL: API_BASE || undefined,
    withCredentials: true,
    headers: { Accept: "application/json" },
  });

  function getStoredToken() {
    try {
      const t1 = localStorage.getItem("auth_token");
      if (t1) return t1;
      const t2 = localStorage.getItem("token");
      if (t2) return t2;
      const raw = localStorage.getItem("user");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          return parsed?.token ?? parsed?.accessToken ?? parsed?.access_token ?? null;
        } catch {
          return null;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    let mounted = true;
    async function fetchMe() {
      setLoading(true);
      setError("");
      try {
        const url = buildUrl(API_BASE, "/api/auth/me");
        const token = getStoredToken();
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await axiosInstance.get(url, { headers });
        if (!mounted) return;
        const payload = res.data ?? null;
        const fetchedUser = payload?.user ?? payload ?? null;
        if (fetchedUser) {
          setUser(fetchedUser);
          setFullName(fetchedUser.fullName ?? fetchedUser.name ?? "");
          setEmail(fetchedUser.email ?? "");
          setAvatar(fetchedUser.avatar ?? "/images/avatar.png");
          if (setContextUser) setContextUser(fetchedUser);
          const returnedToken = payload?.token ?? payload?.accessToken ?? payload?.access_token ?? null;
          if (returnedToken) {
            try {
              localStorage.setItem("auth_token", returnedToken);
              if (setContextAuth) setContextAuth({ user: fetchedUser, token: returnedToken });
            } catch {}
          } else {
            if (setContextAuth) setContextAuth({ user: fetchedUser, token: getStoredToken() });
          }
        } else {
          setUser(null);
          if (setContextUser) setContextUser(null);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch current user:", err);
        setError(
          err?.response?.data?.message ??
            (err?.response?.status ? `Failed to fetch profile (HTTP ${err.response.status})` : "Failed to fetch profile")
        );
        setUser(null);
        if (setContextUser) setContextUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (!user) fetchMe();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      const url = buildUrl(API_BASE, "/api/users/profile");
      const token = getStoredToken();
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const updatedUser = { fullName, email, avatar };

      const res = await axiosInstance.put(url, updatedUser, { headers });
      const data = res.data ?? {};
      const updated = data?.user ?? data ?? {};

      const updatedName = updated.fullName ?? updated.name ?? fullName;
      const updatedEmail = updated.email ?? email;
      const updatedAvatar = updated.avatar ?? avatar;

      setFullName(updatedName);
      setEmail(updatedEmail);
      setAvatar(updatedAvatar);
      setUser((prev) => ({ ...(prev || {}), fullName: updatedName, email: updatedEmail, avatar: updatedAvatar }));

      if (setContextUser) setContextUser((prev) => ({ ...(prev || {}), fullName: updatedName, email: updatedEmail, avatar: updatedAvatar }));
      try {
        const storedRaw = localStorage.getItem("user");
        const stored = storedRaw ? JSON.parse(storedRaw) : {};
        localStorage.setItem("user", JSON.stringify({ ...(stored || {}), fullName: updatedName, email: updatedEmail, avatar: updatedAvatar }));
      } catch {}

      setMessage("Profile updated successfully!");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Profile update failed:", err);
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm">
            <Row className="align-items-center">
              <Col md={4} className="text-center">
                <Image
                  src={avatar || "/images/avatar.png"}
                  roundedCircle
                  width="120"
                  height="120"
                  alt="User Avatar"
                  style={{ objectFit: "cover", boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}
                />
              </Col>
              <Col md={8}>
                <h3 className="m-3 text-center">Your Profile</h3>
                {loading && (
                  <div className="text-center mb-3">
                    <Spinner animation="border" size="sm" /> Loading profile ...
                  </div>
                )}

                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSave}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Avatar URL</Form.Label>
                    <Form.Control type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="/images/avatar.png" />
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" /> Saving ...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}