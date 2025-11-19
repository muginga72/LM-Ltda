// src/components/ProfileModal.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal, Row, Col, Image, Form, Button, Card } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const ProfileModal = ({ show, onHide }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "/avatar.png");
  const [phone, setPhone] = useState(user?.phone || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // File state and preview
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFullName(user?.fullName || "");
    setEmail(user?.email || "");
    setAvatarUrl(user?.avatar || "/avatar.png");
    setPhone(user?.phone || "");
    setMessage("");
    setError("");
    setAvatarFile(null);
  }, [user, show]);

  // When user chooses a file, create preview and store file
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic client-side validation: image type and size limit (5MB)
    if (!file.type.startsWith("image/")) {
      setError(t("Please select a valid image file"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t("Image too large. Max 5MB."));
      return;
    }

    setError("");
    setAvatarFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Trigger hidden file input
  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setUploading(true);

    try {
      const stored = JSON.parse(localStorage.getItem("user")) || {};
      const token = stored?.token;
      if (!token) throw new Error(t("No token found"));

      let res;
      // If an avatar file was selected, use FormData (multipart)
      if (avatarFile) {
        const form = new FormData();
        // Append only fields you want to update
        form.append("phone", phone || "");
        form.append("avatar", avatarFile);
        // Keep fullName/email editable? we keep them read-only as before but include them if present
        form.append("fullName", fullName || "");
        form.append("email", email || "");

        res = await axios.put("/api/users/profile", form, {
          headers: {
            Authorization: `Bearer ${token}`,
            // Let browser set Content-Type with boundary
          },
        });
      } else {
        // Send JSON when no file chosen
        const payload = { phone, avatar: avatarUrl, fullName, email };
        res = await axios.put("/api/users/profile", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      const {
        fullName: updatedName,
        email: updatedEmail,
        avatar: updatedAvatar,
        phone: updatedPhone,
      } = res.data;

      setFullName(updatedName || "");
      setEmail(updatedEmail || "");
      setAvatarUrl(updatedAvatar || "/avatar.png");
      setPhone(updatedPhone || "");
      setAvatarFile(null);

      // Update localStorage user object safely
      const newStoredUser = {
        ...stored,
        fullName: updatedName || stored.fullName,
        email: updatedEmail || stored.email,
        avatar: updatedAvatar || stored.avatar,
        phone: updatedPhone || stored.phone,
      };
      localStorage.setItem("user", JSON.stringify(newStoredUser));

      setMessage(t("Profile updated successfully!"));
    } catch (err) {
      console.error(err);
      // Prefer server message, fallback to JS message, fallback to translation
      const serverMessage = err?.response?.data?.message;
      const msg = serverMessage || err.message || t("Failed to update profile");
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t("Your Profile")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="p-3">
          <Row className="align-items-center">
            <Col md={4} className="text-center">
              <div style={{ position: "relative", display: "inline-block" }}>
                <Image
                  src={avatarUrl}
                  roundedCircle
                  width="120"
                  height="120"
                  alt={t("Your Profile")}
                  style={{
                    objectFit: "cover",
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                  }}
                />
                <div style={{ marginTop: 10 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={triggerFileSelect}
                  >
                    {t("Upload picture")}
                  </Button>
                </div>
              </div>
            </Col>

            <Col md={8}>
              {message && <p className="text-success">{message}</p>}
              {error && <p className="text-danger">{error}</p>}

              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label>{t("Fullname")}</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t("Email")}</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t("Phone")}</Form.Label>
                  <Form.Control
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 555 5555"
                  />
                </Form.Group>

                <div className="d-flex gap-3">
                  <Button
                    variant="outline-primary"
                    type="submit"
                    disabled={uploading}
                  >
                    {uploading ? t("Saving...") : t("Save Changes")}
                  </Button>
                  <Button variant="outline-secondary" onClick={onHide}>
                    {t("Close")}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileModal;