// components/ScheduleServiceModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function ScheduleServiceModal({
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
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setDate("");
    setTime("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!date) {
      setError(t("schedule.errors.dateRequired"));
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Normalize scheduledAt
      const scheduledAt = time
        ? new Date(`${date}T${time}:00`)
        : new Date(`${date}T00:00:00`);

      await axios.post(`${API}/api/schedule`, {
        serviceType: service?.title,
        fullName,
        email,
        date,
        time,
        scheduledAt,
        imagePath: service?.imagePath || "",
        user: user?._id,
        status: "unpaid",
        paid: false,
      });

      resetForm();
      onHide();
      refresh && refresh();
    } catch (err) {
      console.error(err);
      setError(t("schedule.errors.submitFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {t("schedule.title")} — {service.title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{t("schedule.fullName")}</Form.Label>
            <Form.Control
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("schedule.email")}</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("schedule.date")}</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("schedule.time")}</Form.Label>
            <Form.Control
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <Form.Text className="text-muted">
              {t("schedule.optionalTime")}
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t("schedule.cancel")}
        </Button>

        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? t("schedule.saving") : t("schedule.confirm")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}