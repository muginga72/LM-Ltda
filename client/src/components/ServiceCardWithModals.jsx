import React, { useState, useEffect } from "react";
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

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ServiceCardWithModals = ({
  serviceId,
  title,
  description,
  price,
  imagePath,
}) => {
  const { t, i18n } = useTranslation();

  const localKey = `serviceCardState-${title}`;

  const defaultState = {
    showModal: { request: false, schedule: false, share: false },
    selectedService: title,
    activeModalType: "",
    requestData: { fullName: "", email: "", serviceType: "", details: "" },
    scheduleData: {
      fullName: "",
      email: "",
      serviceType: "",
      date: "",
      time: "",
    },
    shareData: { fullName: "", email: "" },
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
    localStorage.setItem(localKey, JSON.stringify(state));
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

  const getPlaceholder = (field) => {
    const { activeModalType } = state;
    const base = activeModalType === "schedule" ? t("button.schedule") : t("button.request");
    if (["request", "schedule", "share"].includes(activeModalType)) {
      if (field === "fullName") return t("placeholder.fullName") || "Your full name";
      if (field === "email") return t("placeholder.email") || `Enter email for ${title}`;
      if (field === "serviceType") return `${base} ${translateTitle(title)}`;
      if (field === "details") return t("placeholder.details") || `Describe your ${title} request...`;
      if (field === "date") return t("placeholder.date") || "mm/dd/yyyy";
      if (field === "time") return t("placeholder.time") || "10:30 AM";
    }
    return "";
  };

  // Translate title/description using service title as key; fallback to raw value
  const translateTitle = (rawTitle) =>
    t(`service.${rawTitle}.title`, { defaultValue: rawTitle });

  const translateDescription = (rawTitle, rawDescription) =>
    t(`service.${rawTitle}.description`, { defaultValue: rawDescription });

  // Format price using current i18n language
  const formatPrice = (value) => {
    if (value == null || value === "") return "";
    try {
      // attempt to detect currency from locale mapping; default to USD
      const locale = i18n.language || "en-US";
      const currency = locale.startsWith("pt") ? "AOA" : locale.startsWith("fr") ? "EUR" : "USD";
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(Number(value));
    } catch {
      return `$${Number(value).toFixed(2)}`;
    }
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

      // Validate required fields
      const requiredFields = ["serviceId", "fullName", "email"];
      const missing = requiredFields.filter((field) => !payload[field]);
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
          defaultValue: `${type.charAt(0).toUpperCase() + type.slice(1)} successful.`,
        })
      );

      setState((prev) => ({
        ...prev,
        showModal: { ...prev.showModal, [type]: false },
        [`${type}Data`]: defaultState[`${type}Data`],
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
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {t(`button.${type}`, { defaultValue: type.charAt(0).toUpperCase() + type.slice(1) })}{" "}
          {translateTitle(title)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {fields.map((field) => (
            <Form.Group key={field} className="mb-3">
              <Form.Label>{t(`form.${field}`, { defaultValue: field })}</Form.Label>
              <Form.Control
                id={field}
                as={field === "details" ? "textarea" : "input"}
                type={field === "details" ? undefined : "text"}
                placeholder={getPlaceholder(field)}
                value={state[`${type}Data`][field] || ""}
                onChange={(e) => handleChange(e, `${type}Data`)}
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose(type)}>
          {t("button.cancel")}
        </Button>
        <Button
          variant="primary"
          onClick={() => handleSubmit(type)}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : t("button.submit")}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const fullImageUrl = imagePath
    ? `${BASE_URL}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`
    : "https://via.placeholder.com/400x300";

  return (
    <>
      <Card className="h-100 shadow-sm d-flex flex-column">
        <div
          style={{
            position: "relative",
            height: "300px",
            overflow: "hidden",
          }}
        >
          <Card.Img
            src={fullImageUrl}
            alt={title}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              display: "block",
              borderRadius: "6px 6px 0 0",
            }}
          />
          {price && (
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
              <span className="badge bg-warning fs-6">
                {formatPrice(price)}
              </span>
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
              <Button
                variant="outline-primary"
                onClick={() => handleShow("request")}
              >
                {t("button.request")}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => handleShow("schedule")}
              >
                {t("button.schedule")}
              </Button>
              <Button
                variant="outline-info"
                onClick={() => handleShow("share")}
              >
                {t("button.share")}
              </Button>
            </div>
          </ButtonGroup>
        </div>
      </Card>

      {renderModal("request", ["fullName", "email", "serviceType", "details"])}
      {renderModal("schedule", [
        "fullName",
        "email",
        "serviceType",
        "date",
        "time",
      ])}
      {renderModal("share", ["fullName", "email"])}
    </>
  );
};

export default ServiceCardWithModals;