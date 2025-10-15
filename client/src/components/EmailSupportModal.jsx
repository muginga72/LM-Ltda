// components/EmailSupportModal.jsx
import React, { useState } from "react";
import { Modal, Button, Alert, Form } from "react-bootstrap";
import axios from "axios";

function EmailSupportModal({ fullName, show, handleClose, serviceId, email }) {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSendEmail = async () => {
    if (!fullName || !email || !serviceId || !file) {
      setStatus("Please provide all required information and attach a file.");
      return;
    }

    setSending(true);
    setStatus("");

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("userEmail", email);
    formData.append("serviceId", serviceId);
    formData.append("attachment", file);

    try {
      const res = await axios.post("/api/send-payment-email", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(res.data.message || "Email sent successfully.");
    } catch (err) {
      console.error(err);
      setStatus("Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Email Support</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Notify support that you've made a payment for service ID:{" "}
          <strong>{serviceId}, {fullName}</strong>.
        </p>
        <Form.Group controlId="formFile">
          <Form.Label>Attach proof of payment (PDF, image, etc.):</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        {status && <Alert variant="info" className="mt-3">{status}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSendEmail} disabled={sending}>
          {sending ? "Sending..." : "Send Email"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EmailSupportModal;