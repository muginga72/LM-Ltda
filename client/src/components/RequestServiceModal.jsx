// components/RequestServiceModal.jsx
import React, { useEffect, useState } from "react";
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
  const { t, i18n } = useTranslation();
  const API = apiBaseUrl || process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Helper to prefer common name fields from the signed-in user
  const getUserName = (u) => u?.name || u?.fullName || u?.displayName || "";

  // Local controlled state
  const [fullName, setFullName] = useState(getUserName(user));
  // Email should be the shared person's email associated with the service
  const [email, setEmail] = useState(service?.sharedEmail || "");
  const [details, setDetails] = useState("");
  // Keep a local copy of the service title so it renders even if `service` arrives asynchronously
  const [serviceTitle, setServiceTitle] = useState(
    service?.title || service?.name || service?.serviceTitle || ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Determine locale for European date formatting based on i18n language
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

  // Format a Date (or ISO string) to DD/MM/YYYY using the chosen locale
  const formatDateEuropean = (dateInput) => {
    if (!dateInput) return "";
    const dt = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Sync fullName when user changes (user may be loaded async)
  useEffect(() => {
    setFullName(getUserName(user));
  }, [user]);

  // Sync email and serviceTitle when service changes (service may be loaded async)
  useEffect(() => {
    setEmail(service?.sharedEmail || "");
    setServiceTitle(service?.title || service?.name || service?.serviceTitle || "");
  }, [service]);

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setFullName(getUserName(user));
      setEmail(service?.sharedEmail || "");
      setServiceTitle(service?.title || service?.name || service?.serviceTitle || "");
      setDetails("");
      setError("");
    }
  }, [show, user, service]);

  const resetForm = () => {
    setDetails("");
    setError("");
    setEmail(service?.sharedEmail || "");
  };

  const handleSubmit = async () => {
    if (!details.trim()) {
      setError(t("request.errors.detailsRequired"));
      return;
    }

    try {
      setLoading(true);
      setError("");

      const requestedAt = new Date();

      await axios.post(`${API}/api/requests`, {
        // Use the local serviceTitle to ensure the title is sent even if service prop was async
        serviceTitle: serviceTitle || service?.title || "",
        serviceType: service?.type || service?.title || serviceTitle || "",
        fullName,
        // Email must be the shared person's email associated with the service
        email: email || "",
        details,
        imagePath: service?.imagePath || "",
        paid: false,
        status: "unpaid",
        user: user?._id,
        // include requestedAt as ISO for backend; UI shows European formatted date
        requestedAt: requestedAt.toISOString(),
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

  // Show today's date in European format for clarity inside the modal
  const todayEuropean = formatDateEuropean(new Date());

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {t("request.title")} — {serviceTitle || t("request.unknownService") || "Service"}
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
              aria-label={t("request.fullName")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("request.email")}</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
              aria-label={t("request.email")}
            />
            {!service?.sharedEmail && (
              <Form.Text className="text-muted">Shared email is required</Form.Text>
            )}
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
            {/* Display the request date in European format */}
            <Form.Text className="text-muted">Request date: {todayEuropean}
            </Form.Text>
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