// components/ServiceCardWithModals.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Card, Button, ButtonGroup, Modal, Form, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ServiceCardWithModals = ({
  serviceId,
  title = "No title",
  description = "",
  price = "", // expected as USD numeric or string
  imagePath = "",
}) => {
  const { t, i18n } = useTranslation();

  // Persist state per service
  const localKey = `serviceCardState-${serviceId || title}`;
  const defaultState = {
    showModal: { request: false, schedule: false, share: false },
    activeModalType: "",
    requestData: { fullName: "", email: "", serviceType: "", details: "" },
    scheduleData: { fullName: "", email: "", serviceType: "", date: "", time: "" },
    shareData: { fullName: "", email: "", notes: "" },
  };

  const [state, setState] = useState(defaultState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(localKey);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {
        setState(defaultState);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localKey]);

  useEffect(() => {
    try {
      localStorage.setItem(localKey, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state, localKey]);

  const handleShow = (type) => {
    setState((prev) => ({
      ...prev,
      activeModalType: type,
      showModal: { ...prev.showModal, [type]: true },
    }));
  };

  const handleClose = (type) => {
    setState((prev) => ({
      ...prev,
      showModal: { ...prev.showModal, [type]: false },
      activeModalType: "",
    }));
  };

  const handleChange = (e, formType) => {
    const { id, value } = e.target;
    setState((prev) => ({
      ...prev,
      [formType]: { ...prev[formType], [id]: value },
    }));
  };

  // Title/description translation with sensible fallback
  const translateTitle = (rawTitle) =>
    t(`service.${rawTitle}.title`, { defaultValue: rawTitle });

  const translateDescription = (rawTitle, rawDescription) =>
    t(`service.${rawTitle}.description`, { defaultValue: rawDescription });

  // Humanize field keys into Title Case
  const humanizeField = (key) => {
    if (!key) return "";
    const spaced = key
      .replace(/_/g, " ")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .trim();
    return spaced
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  // Localized placeholders in en, pt, fr with dynamic service title
  const getPlaceholder = (field) => {
    const { activeModalType } = state;
    const base =
      activeModalType === "schedule"
        ? t("button.schedule", { defaultValue: "Schedule" })
        : t("button.request", { defaultValue: "Request" });

    if (!["request", "schedule", "share"].includes(activeModalType)) return "";

    if (field === "fullName")
      return t("placeholder.fullName", { defaultValue: "Your full name" });

    if (field === "email")
      return t("placeholder.emailFor", {
        service: translateTitle(title),
        defaultValue: `Enter your email for ${translateTitle(title)}`,
      });

    if (field === "serviceType")
      return t("placeholder.serviceType", {
        action: base,
        service: translateTitle(title),
        defaultValue: `${base} ${translateTitle(title)}`,
      });

    if (field === "details")
      return t("placeholder.details", {
        service: translateTitle(title),
        defaultValue: `Describe your ${translateTitle(title)} request ...`,
      });

    if (field === "notes")
      return t("placeholder.notes", {
        service: translateTitle(title),
        defaultValue: `Add any notes about ${translateTitle(title)}...`,
      });

    if (field === "date")
      return t("placeholder.date", { defaultValue: "e.g. mm/dd/yyyy" });

    if (field === "time")
      return t("placeholder.time", { defaultValue: "e.g. 10:30 AM" });

    return "";
  };

  // ---- Currency conversion logic ----
  const conversionRates = useMemo(
    () => ({
      USD: 1,
      EUR: 0.8615, // 1 USD = 0.8615 EUR
      AOA: 912.085, // 1 USD = 912.085 AOA
    }),
    []
  );

  const getCurrencyForLocale = (locale) => {
    const l = String(locale || "").toLowerCase();
    if (l.startsWith("pt")) return "AOA";
    if (l.startsWith("fr")) return "EUR";
    return "USD";
  };

  const formatPrice = (value) => {
    if (value == null || value === "") return "";
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return "";

    const locale = i18n.language || "en-US";
    const currency = getCurrencyForLocale(locale);
    const rate = conversionRates[currency] ?? 1;
    const converted = numeric * rate;

    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(converted);
    } catch {
      return `${converted.toFixed(2)} ${currency}`;
    }
  };
  // end currency conversion logic

  const handleSubmit = async (type) => {
    setLoading(true);
    try {
      const endpoint = {
        request: "/api/requests",
        schedule: "/api/schedules",
        share: "/api/shares",
      }[type];

      const formData = state[`${type}Data`] || {};
      // Build payload so share includes notes (notes are part of formData)
      const payload = {
        ...formData,
        serviceTitle: title,
        serviceId,
      };

      // Required fields (validate against formData)
      const requiredFields = ["fullName", "email"];
      const missing = requiredFields.filter((field) => !formData[field]);
      if (missing.length > 0) {
        throw new Error(
          `${missing.join(", ")} ${missing.length > 1 ? "are" : "is"} required.`
        );
      }

      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorData = {};
        try {
          errorData = await res.json();
        } catch {}
        throw new Error(errorData.error || `Failed to ${type} service`);
      }

      alert(
        t("notification.success", {
          defaultValue:
            type.charAt(0).toUpperCase() + type.slice(1) + " successful.",
        })
      );

      setState((prev) => ({
        ...prev,
        showModal: { ...prev.showModal, [type]: false },
        [`${type}Data`]: defaultState[`${type}Data`],
        activeModalType: "",
      }));
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderModal = (type, fields) => (
    <Modal show={state.showModal[type]} onHide={() => handleClose(type)} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {t(`button.${type}`, {
            defaultValue: type.charAt(0).toUpperCase() + type.slice(1),
          })}{" "}
          {translateTitle(title)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {fields.map((field) => {
            const isTextarea = field === "details" || field === "notes";
            const defaultLabel = humanizeField(field);
            return (
              <Form.Group key={field} className="mb-3">
                <Form.Label>{t(`form.${field}`, { defaultValue: defaultLabel })}</Form.Label>
                <Form.Control
                  id={field}
                  name={field}
                  as={isTextarea ? "textarea" : "input"}
                  type={isTextarea ? undefined : "text"}
                  placeholder={getPlaceholder(field)}
                  value={state[`${type}Data`][field] || ""}
                  onChange={(e) => handleChange(e, `${type}Data`)}
                />
              </Form.Group>
            );
          })}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose(type)}>
          {t("button.cancel", { defaultValue: "Cancel" })}
        </Button>
        <Button variant="primary" onClick={() => handleSubmit(type)} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : t("button.submit", { defaultValue: "Submit" })}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const fullImageUrl = imagePath
    ? `${BASE_URL}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`
    : "https://via.placeholder.com/400x300";

  return (
    <>
      <Card
        className="h-100 shadow-sm d-flex flex-column"
        style={{ borderRadius: 24, overflow: "hidden" }}
      >
        <div style={{ position: "relative", height: "300px", overflow: "hidden" }}>
          <Card.Img
            src={fullImageUrl}
            alt={title}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              display: "block",
              borderRadius: "24px 24px 0 0",
            }}
          />
          {price !== "" && price !== null && (
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "0.9rem",
                zIndex: 2,
              }}
            >
              <span className="badge bg-warning fs-6">{formatPrice(price)}</span>
            </div>
          )}
        </div>

        <Card.Body>
          <Card.Title>{translateTitle(title)}</Card.Title>
          <Card.Text>{translateDescription(title, description)}</Card.Text>
        </Card.Body>

        <div className="px-2 pb-3">
          <ButtonGroup vertical className="w-100 px-3">
            <div className="d-flex gap-4 mt-2 flex-wrap">
              <Button variant="outline-primary" onClick={() => handleShow("request")}>
                {t("button.request", { defaultValue: "Request" })}
              </Button>
              <Button variant="outline-secondary" onClick={() => handleShow("schedule")}>
                {t("button.schedule", { defaultValue: "Schedule" })}
              </Button>
              <Button variant="outline-info" onClick={() => handleShow("share")}>
                {t("button.share", { defaultValue: "Share" })}
              </Button>
            </div>
          </ButtonGroup>
        </div>
      </Card>

      {renderModal("request", ["fullName", "email", "serviceType", "details"])}
      {renderModal("schedule", ["fullName", "email", "serviceType", "date", "time"])}
      {renderModal("share", ["fullName", "email", "notes"])}
    </>
  );
};

export default ServiceCardWithModals;