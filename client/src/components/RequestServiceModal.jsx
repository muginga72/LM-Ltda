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

  // Ensure API is a full origin string. Prefer explicit prop, then env, then default.
  const defaultApi = "http://localhost:5000";
  const API =
    (apiBaseUrl && apiBaseUrl.startsWith("http"))
      ? apiBaseUrl
      : (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.startsWith("http"))
      ? process.env.REACT_APP_API_URL
      : defaultApi;

  const getUserName = (u) => u?.name || u?.fullName || u?.displayName || "";

  const [fullName, setFullName] = useState(getUserName(user));
  const [email, setEmail] = useState(service?.sharedEmail || "");
  const [details, setDetails] = useState("");
  const [serviceTitle, setServiceTitle] = useState(
    service?.title || service?.name || service?.serviceTitle || ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  useEffect(() => {
    setFullName(getUserName(user));
  }, [user]);

  useEffect(() => {
    if (service?.sharedEmail) {
      setEmail(service.sharedEmail);
    } else {
      setEmail((prev) => prev || "");
    }
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
      setSuccessMessage("");
    }
  }, [show, user, service]);

  const resetForm = () => {
    setDetails("");
    setError("");
    setEmail(service?.sharedEmail || "");
    setSuccessMessage("");
  };

  const isValidEmail = (value) => {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    if (!fullName || !fullName.trim()) {
      setError(t("request.errors.fullNameRequired") || "Full name is required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError(t("request.errors.validEmail") || "Please enter a valid email address.");
      return;
    }

    if (!details.trim()) {
      setError(t("request.errors.detailsRequired") || "Details are required.");
      return;
    }

    // Ensure we include serviceId (backend requires it)
    const serviceId = service?._id || service?.id || service?.serviceId || "";

    if (!serviceId) {
      setError("Service identifier is missing. Please select a valid service.");
      return;
    }

    try {
      setLoading(true);

      const requestedAt = new Date();

      const payload = {
        serviceId,
        serviceTitle: serviceTitle || service?.title || "",
        serviceType: service?.type || service?.title || serviceTitle || "",
        fullName: fullName.trim(),
        email: email.trim(),
        details: details.trim(),
        imagePath: service?.imagePath || "",
        paid: false,
        status: "unpaid",
        user: user?._id,
        requestedAt: requestedAt.toISOString(),
      };

      const response = await axios.post(`${API}/api/requests`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response && response.data && response.data.message) {
        setSuccessMessage(response.data.message);
      } else {
        setSuccessMessage(t("request.success") || "Request submitted successfully.");
      }

      resetForm();
      onHide();
      refresh && refresh();
    } catch (err) {
      if (err.response && err.response.data) {
        const serverMsg =
          err.response.data.message ||
          (typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data));
        setError(serverMsg);
        console.error("Server validation error:", err.response.data);
      } else {
        setError(t("request.errors.submitFailed") || "Failed to submit request.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const todayEuropean = formatDateEuropean(new Date());
  const isEmailReadOnly = Boolean(service?.sharedEmail);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {t("request.title")} — {serviceTitle || t("request.unknownService") || "Service"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

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
              readOnly={isEmailReadOnly}
              aria-label={t("request.email")}
            />
            {!isEmailReadOnly ? (
              <Form.Text className="text-muted">Enter destination email</Form.Text>
            ) : (
              <Form.Text className="text-muted">Using shared email for this service</Form.Text>
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
            <Form.Text className="text-muted">Request date: {todayEuropean}</Form.Text>
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