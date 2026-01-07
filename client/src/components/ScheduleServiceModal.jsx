// components/ScheduleServiceModal.jsx
import React, { useEffect, useState } from "react";
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
  const { t, i18n } = useTranslation();
  const API = apiBaseUrl || process.env.REACT_APP_API_URL || "https://lmltda-api.onrender.com";

  const getUserName = (u) => u?.name || u?.fullName || u?.displayName || "";
  const getUserEmail = (u) => u?.email || u?.mail || u?.username || "";

  const [fullName, setFullName] = useState(getUserName(user));
  const [email, setEmail] = useState(getUserEmail(user));
  const [date, setDate] = useState(""); 
  const [time, setTime] = useState(""); 
  const [serviceTitle, setServiceTitle] = useState(
    service?.title || service?.name || service?.serviceTitle || ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Map i18n language to a locale that uses European date format (day/month/year)
  const localeForEuropeanDates = (lang) => {
    if (!lang) return "en-GB";
    const code = lang.split("-")[0];
    switch (code) {
      case "pt":
        return "pt-PT";
      case "fr":
        return "fr-FR";
      case "en":
      default:
        return "en-GB";
    }
  };

  const locale = localeForEuropeanDates(i18n.language);

  const formatDateEuropean = (yyyyMmDd) => {
    if (!yyyyMmDd) return "";
    const parts = yyyyMmDd.split("-");
    if (parts.length !== 3) return yyyyMmDd;
    const [y, m, d] = parts.map((p) => parseInt(p, 10));
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTimeLocalized = (hhMm) => {
    if (!hhMm) return "";
    const [hh, mm] = hhMm.split(":").map((p) => parseInt(p, 10));
    const dt = new Date();
    dt.setHours(hh, mm, 0, 0);
    return dt.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    setFullName(getUserName(user));
    setEmail(getUserEmail(user));
  }, [user]);

  useEffect(() => {
    setServiceTitle(service?.title || service?.name || service?.serviceTitle || "");
  }, [service]);

  // Reset when modal opens
  useEffect(() => {
    if (show) {
      setFullName(getUserName(user));
      setEmail(getUserEmail(user));
      setServiceTitle(service?.title || service?.name || service?.serviceTitle || "");
      setDate("");
      setTime("");
      setError("");
    }
  }, [show, user, service]);

  const resetForm = () => {
    setDate("");
    setTime("");
    setError("");
    setFullName(getUserName(user));
    setEmail(getUserEmail(user));
  };

  const handleSubmit = async () => {
    if (!date) {
      setError(t("schedule.errors.dateRequired"));
      return;
    }

    try {
      setLoading(true);
      setError("");

      let scheduledAt;
      if (time) {
        scheduledAt = new Date(`${date}T${time}:00`);
      } else {
        scheduledAt = new Date(`${date}T00:00:00`);
      }

      await axios.post(`${API}/api/schedules`, {
        serviceType: serviceTitle || service?.title || "",
        fullName,
        email: email || "",
        date, 
        time, 
        scheduledAt: scheduledAt.toISOString(),
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
          {t("schedule.title")} — {serviceTitle || t("schedule.unknownService")}
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
              aria-label={t("schedule.fullName")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("schedule.email")}</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label={t("schedule.email")}
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
            {/* Show the selected date in European format for clarity */}
            {date && (
              <Form.Text className="text-muted">
                {t("schedule.selectedDate")}: {formatDateEuropean(date)}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("schedule.time")}</Form.Label>
            <Form.Control
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            {/* Show localized time preview */}
            {time && (
              <Form.Text className="text-muted">
                {t("schedule.selectedTime")}: {formatTimeLocalized(time)}
              </Form.Text>
            )}
            <Form.Text className="text-muted">{t("schedule.optionalTime")}</Form.Text>
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