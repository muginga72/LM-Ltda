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

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ServiceCardWithModals = ({
  serviceId,
  title,
  description,
  price,
  imagePath,
}) => {
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
      setState(JSON.parse(saved));
    }
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
    const base = activeModalType === "schedule" ? "Scheduling for" : "Type of";
    if (["request", "schedule", "share"].includes(activeModalType)) {
      if (field === "fullName") return "Your full name";
      if (field === "email") return `Enter email to share ${title}`;
      if (field === "serviceType") return `${base} ${title}`;
      if (field === "details") return `Describe your ${title} request...`;

      // new placeholders for scheduling
      if (field === "date") return "Enter the date, e.g. mm/dd/yyy";
      if (field === "time") return "Enter the time, e.g. 10:30 AM";
    }
    return "";
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
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to ${type} service`);
      }

      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} successful.`);

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
          {type.charAt(0).toUpperCase() + type.slice(1)} {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {fields.map((field) => (
            <Form.Group key={field} className="mb-3">
              <Form.Label>{field}</Form.Label>
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
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => handleSubmit(type)}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
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
              <span className="badge bg-warning fs-6">${price.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{description}</Card.Text>
        </Card.Body>
        <div className="px-4 pb-3">
          <ButtonGroup vertical className="w-100 px-4">
            <div className="d-flex gap-4 mt-2 flex-wrap">
              <Button
                variant="outline-primary"
                onClick={() => handleShow("request")}
              >
                Request
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => handleShow("schedule")}
              >
                Schedule
              </Button>
              <Button
                variant="outline-info"
                onClick={() => handleShow("share")}
              >
                Share
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
