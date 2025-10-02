import React, { useState, useEffect } from "react";
import { Card, Button, ButtonGroup, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ServiceCardWithModals = ({ title, description, image, price }) => {
  const localKey = `serviceCardState-${title}`;

  const defaultState = {
    showModal: { request: false, schedule: false, share: false },
    selectedService: title,
    activeModalType: "",
    requestData: { fullName: "", serviceType: "", details: "" },
    scheduleData: { fullName: "", serviceType: "", date: "", time: "" },
    shareData: { email: "" },
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
    if (activeModalType === "request") {
      if (field === "fullName") return "Your full name";
      if (field === "serviceType") return `Type of ${title}`;
      if (field === "details") return `Describe your ${title} request...`;
    }
    if (activeModalType === "schedule") {
      if (field === "fullName") return "Your full name";
      if (field === "serviceType") return `Scheduling for ${title}`;
    }
    if (activeModalType === "share") {
      if (field === "email") return `Enter email to share ${title}`;
    }
    return "";
  };

  const handleSubmit = async (type) => {
    setLoading(true);
    try {
      if (type === "request") {
        const res = await fetch("/api/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceTitle: title,
            ...state.requestData,
          }),
        });
        if (!res.ok) throw new Error("Failed to submit request");
        alert("Service request submitted successfully.");
      }

      if (type === "schedule") {
        const res = await fetch("/api/schedules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceTitle: title,
            ...state.scheduleData,
          }),
        });
        if (!res.ok) throw new Error("Failed to schedule service");
        alert("Service scheduled successfully.");
      }

      if (type === "share") {
        const res = await fetch("/api/shares", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceTitle: title,
            ...state.shareData,
          }),
        });
        if (!res.ok) throw new Error("Failed to share service");
        alert(`Service shared with ${state.shareData.email}`);
      }

      // Reset form data
      setState((prev) => ({
        ...prev,
        showModal: { ...prev.showModal, [type]: false },
        [`${type}Data`]: defaultState[`${type}Data`],
      }));
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="h-100 shadow-sm d-flex flex-column">
        {image && (
          <div
            style={{
              position: "relative",
              height: "300px",
              overflow: "hidden",
            }}
          >
            <Card.Img
              src={image}
              alt={title}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                display: "block",
                borderRadius: "6px 6px 0 0",
              }}
            />
            {price && price.trim() !== "" && (
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
                  ${price || "0.00"}
                </span>
              </div>
            )}
          </div>
        )}

        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{description}</Card.Text>
        </Card.Body>

        <div className="px-4 pb-3">
          <ButtonGroup vertical className="w-100 px-3">
            <div className="d-flex gap-3 mt-2">
            <Button variant="outline-primary" onClick={() => handleShow("request")}>
              Request
            </Button>
            <Button variant="outline-secondary" onClick={() => handleShow("schedule")}>
              Schedule
            </Button>
            <Button variant="outline-info" onClick={() => handleShow("share")}>
              Share
            </Button>
            {/* <Button variant="outline-warning">
              Pay
            </Button> */}
          </div>
          </ButtonGroup>
        </div>
      </Card>

      {/* Modals */}
      {["request", "schedule", "share"].map((type) => (
        <Modal
          key={type}
          show={state.showModal[type]}
          onHide={() => handleClose(type)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {type === "request"
                ? "Request Services"
                : type === "schedule"
                ? "Schedule Services"
                : "Share Service"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {type !== "share" && (
                <>
                  <Form.Group controlId="fullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={getPlaceholder("fullName")}
                      value={state[`${type}Data`].fullName}
                      onChange={(e) => handleChange(e, `${type}Data`)}
                    />
                  </Form.Group>
                  <Form.Group controlId="serviceType">
                    <Form.Label>Service Type</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={getPlaceholder("serviceType")}
                      value={state[`${type}Data`].serviceType}
                      onChange={(e) => handleChange(e, `${type}Data`)}
                    />
                  </Form.Group>
                </>
              )}
              {type === "request" && (
                <Form.Group controlId="details" className="mt-3">
                  <Form.Label>Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder={getPlaceholder("details")}
                    value={state.requestData.details}
                    onChange={(e) => handleChange(e, "requestData")}
                  />
                </Form.Group>
              )}
              {type === "schedule" && price && (
                <>
                  <div className="alert alert-warning fw-bold text-center mt-3">
                    Price for this service: ${price}
                  </div>
                  <Form.Group controlId="date" className="mt-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={state.scheduleData.date}
                      onChange={(e) => handleChange(e, "scheduleData")}
                    />
                  </Form.Group>
                  <Form.Group controlId="time" className="mt-3">
                    <Form.Label>Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={state.scheduleData.time}
                      onChange={(e) => handleChange(e, "scheduleData")}
                    />
                  </Form.Group>
                </>
              )}
              {type === "share" && (
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder={getPlaceholder("email")}
                    value={state.shareData.email}
                    onChange={(e) => handleChange(e, "shareData")}
                  />
                </Form.Group>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => handleClose(type)}>
              Close
            </Button>
            <Button
              variant={
                type === "request"
                  ? "success"
                  : type === "schedule"
                  ? "primary"
                  : "outline-secondary"
              }
              onClick={() => handleSubmit(type)}
              disabled={
                loading ||
                (type === "request" &&
                  (!state.requestData.serviceType ||
                    !state.requestData.details)) ||
                (type === "schedule" &&
                  (!state.scheduleData.fullName ||
                    !state.scheduleData.serviceType ||
                    !state.scheduleData.date ||
                    !state.scheduleData.time)) ||
                (type === "share" && !state.shareData.email)
              }
            >
              {type === "request"
                ? "Submit Request"
                : type === "schedule"
                ? "Confirm Schedule"
                : "Share"}
            </Button>
          </Modal.Footer>
        </Modal>
      ))}
    </>
  );
};

export default ServiceCardWithModals;