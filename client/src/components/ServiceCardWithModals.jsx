// components/ServiceCardWithModals.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Button,
  ButtonGroup,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";

const BASE_URL = process.env.REACT_APP_API_URL || "https://lmltda-api.onrender.com";

const ServiceCardWithModals = ({
  serviceId,
  title = "No title",
  description = "",
  price = "",
  imagePath = "",
}) => {
  const { t, i18n } = useTranslation();

  const idKey = serviceId ?? title;
  const localKey = `serviceCardState-${idKey}`;

  const defaultState = useMemo(
    () => ({
      showModal: { request: false, schedule: false, share: false },
      activeModalType: "",
      requestData: { fullName: "", email: "", serviceType: "", details: "" },
      scheduleData: {
        fullName: "",
        email: "",
        serviceType: "",
        date: "",
        time: "",
      },
      shareData: { fullName: "", email: "", notes: "" },
    }),
    []
  );

  const [state, setState] = useState(defaultState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(localKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState((prev) => ({ ...prev, ...parsed }));
      } catch {
        setState(defaultState);
      }
    }
  }, [localKey, defaultState]);

  useEffect(() => {
    try {
      localStorage.setItem(localKey, JSON.stringify(state));
    } catch {}
  }, [state, localKey]);

  const conversionRates = useMemo(
    () => ({
      USD: 1,
      EUR: 0.8615,
      AOA: 912.085,
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

    const locale = i18n?.language || "en-US";
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

  const translateTitle = (rawTitle) =>
    t(`service.${rawTitle}.title`, { defaultValue: rawTitle });

  const translateDescription = (rawTitle, rawDescription) =>
    t(`service.${rawTitle}.description`, { defaultValue: rawDescription });

  const humanizeField = (key) => {
    if (!key) return "";
    const snakeHandled = key.replace(/_/g, " ");
    const withSpaces = snakeHandled.replace(/([A-Z])/g, " $1").trim();
    return withSpaces
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const getPlaceholder = (field) => {
    const base =
      state.activeModalType === "schedule"
        ? t("button.schedule", { defaultValue: "Schedule" })
        : t("button.request", { defaultValue: "Request" });

    const service = translateTitle(title);

    const placeholders = {
      fullName: t("placeholder.fullName", { defaultValue: "Your full name" }),
      email: t("placeholder.emailFor", {
        service,
        defaultValue: `Enter your email for ${service}`,
      }),
      serviceType: t("placeholder.serviceType", {
        action: base,
        service,
        defaultValue: `${base} ${service}`,
      }),
      details: t("placeholder.details", {
        service,
        defaultValue: `Describe your ${service} request ...`,
      }),
      notes: t("placeholder.notes", {
        service,
        defaultValue: `Add any notes about ${service} ...`,
      }),
      date: t("placeholder.date", { defaultValue: "e.g. mm/dd/yyyy" }),
      time: t("placeholder.time", { defaultValue: "e.g. 10:30 AM" }),
    };

    return placeholders[field] || "";
  };

  const handleSubmit = async (type) => {
    setLoading(true);
    try {
      const endpoint = {
        request: "/api/requests",
        schedule: "/api/schedules",
        share: "/api/shares",
      }[type];

      const formData = state[`${type}Data`];
      const payload = {
        ...formData,
        serviceTitle: title,
        serviceId,
      };

      const requiredFields = ["serviceId", "fullName", "email"];
      const missing = requiredFields.filter((field) => {
        if (field === "serviceId") return !payload.serviceId;
        return !payload[field];
      });

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
    <Modal
      show={state.showModal[type]}
      onHide={() => handleClose(type)}
      centered
      key={`modal-${type}-${idKey}`}
    >
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
            const formKey = `${type}Data`;
            return (
              <Form.Group key={`${idKey}-${field}`} className="mb-3">
                <Form.Label>
                  {t(`form.${field}`, { defaultValue: humanizeField(field) })}
                </Form.Label>
                <Form.Control
                  id={field}
                  name={field}
                  as={isTextarea ? "textarea" : "input"}
                  type={isTextarea ? undefined : "text"}
                  placeholder={getPlaceholder(field)}
                  value={(state[formKey] && state[formKey][field]) || ""}
                  onChange={(e) => handleChange(e, formKey)}
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
        <Button
          variant="primary"
          onClick={() => handleSubmit(type)}
          disabled={loading}
        >
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            t("button.submit", { defaultValue: "Submit" })
          )}
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
        key={`card-${idKey}`}
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
          {price !== "" && price != null && (
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "24px",
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
              <Button variant="outline-primary" onClick={() => handleShow("request")} style={{borderRadius: 24}}>
                {t("button.request", { defaultValue: "Request" })}
              </Button>
              <Button variant="outline-secondary" onClick={() => handleShow("schedule")} style={{borderRadius: 24}}>
                {t("button.schedule", { defaultValue: "Schedule" })}
              </Button>
              <Button variant="outline-info" onClick={() => handleShow("share")} style={{borderRadius: 24}}>
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