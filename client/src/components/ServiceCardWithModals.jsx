import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  ButtonGroup,
  Modal,
  Form,
  Spinner,
  Container,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ServiceCardWithModals = ({ service }) => {
  const { title, description, price, imagePath } = service;
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

      const payload = {
        serviceTitle: title,
        ...state[`${type}Data`],
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Failed to ${type} service`);
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} successful.`);

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
                type={field === "details" ? "textarea" : "text"}
                placeholder={getPlaceholder(field)}
                value={state[`${type}Data`][field]}
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

  return (
    <>
      <Card className="h-100 shadow-sm d-flex flex-column">
        {imagePath && (
          <div
            style={{
              position: "relative",
              height: "300px",
              overflow: "hidden",
            }}
          >
            <Card.Img
              src={imagePath}
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
                  ${price.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{description}</Card.Text>
        </Card.Body>
        <div className="px-3 pb-3">
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

const ServiceGallery = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from backend + localStorage
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const dbServices = await res.json();

        // Load local-only services
        const localServices =
          JSON.parse(localStorage.getItem("localServices")) || [];

        // Merge them
        setServices([...dbServices, ...localServices]);
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false); // ✅ stop loading after fetch
      }
    };
    fetchServices();
  }, []);

  // Delete handler for both local-only and backend cards
  const handleDelete = async (id, isLocal) => {
    if (isLocal) {
      // Remove from state and localStorage
      const updated = services.filter((s) => s._id !== id);
      setServices(updated);
      const localServices = updated.filter((s) => s.isLocal);
      localStorage.setItem("localServices", JSON.stringify(localServices));
    } else {
      try {
        setLoading(true);
        const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete service");
        const updated = services.filter((s) => s._id !== id);
        setServices(updated);
      } catch (err) {
        console.error("Error deleting service:", err);
        alert("Failed to delete service. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading services...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center my-5">
        <p>No services available.</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <div className="row g-4">
        {services.map((service) => (
          <div key={service._id} className="col-12 col-md-6">
            <ServiceCardWithModals service={service} onDelete={handleDelete} />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ServiceGallery;