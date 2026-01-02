// components/RequestServiceModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function RequestServiceModal({
  show,
  onHide,
  service,
  user,
  apiBaseUrl,
  refresh,
}) {
  const { t } = useTranslation();
  const API =
    apiBaseUrl || process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [details, setDetails] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setDetails("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!details.trim()) {
      setError(t("request.errors.detailsRequired"));
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(`${API}/api/request`, {
        serviceTitle: service?.title,
        serviceType: service?.type || service?.title,
        fullName,
        email,
        details,
        imagePath: service?.imagePath || "",
        paid: false,
        status: "unpaid",
        user: user?._id,
      });

      resetForm();
      onHide();
      refresh && refresh();
    } catch (err) {
      console.error(err);
      setError(t("request.errors.submitFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {t("request.title")} — {service.title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{t("request.fullName")}</Form.Label>
            <Form.Control
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("request.email")}</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("request.details")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={t("request.detailsPlaceholder")}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t("request.cancel")}
        </Button>

        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? t("request.saving") : t("request.confirm")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}