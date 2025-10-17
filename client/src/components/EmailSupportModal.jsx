import React, { useState, useEffect } from "react";
import { Modal, Button, Alert, Table, Spinner, Form } from "react-bootstrap";
import axios from "axios";

function EmailSupportModal({ show, handleClose, serviceId }) {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Fetch user info when modal opens
  useEffect(() => {
    const fetchServiceInfo = async () => {
      if (!serviceId || !show) return;
      setLoading(true);
      try {
        const res = await axios.get(`/api/${serviceId}`);
        setFullName(res.data.fullName);
        setEmail(res.data.email);
        setStatus(""); // clear any previous error
      } catch (err) {
        console.error("Fetch service info error:", err);
        if (err.response?.status === 404) {
          setStatus("No service found for this ID.");
        } else {
          setStatus("Failed to load service information.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchServiceInfo();
  }, [serviceId, show]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus(""); // Clear status on new file
  };

  const handleSendEmail = async () => {
    if (!fullName?.trim() || !email?.trim() || !serviceId?.toString().trim() || !file) {
      setStatus("Please provide all required information and attach a file.");
      return;
    }

    setSending(true);
    setStatus("");

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("serviceId", serviceId);
    formData.append("attachment", file);

    try {
      const res = await axios.post("/api/send-payment-email", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(res.data.message || "Email sent successfully.");
    } catch (err) {
      console.error("Email error:", err);
      setStatus("Failed to send email. Please try again.");
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
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Loading service info...</p>
          </div>
        ) : (
          <>
            <p>
              Notify support that you've made a payment for service ID:{" "}
              <strong>{serviceId}</strong>
            </p>

            {/* Display info in a table */}
            <Table bordered hover responsive>
              <tbody>
                <tr>
                  <th>Full Name</th>
                  <td>{fullName || "—"}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{email || "—"}</td>
                </tr>
                <tr>
                  <th>Service ID</th>
                  <td>{serviceId}</td>
                </tr>
              </tbody>
            </Table>

            {/* File upload */}
            <Form.Group controlId="formFile">
              <Form.Label>Attach proof of payment (PDF, image, etc.):</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
              />
            </Form.Group>

            {status && <Alert variant="info" className="mt-3">{status}</Alert>}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSendEmail}
          disabled={sending || loading}
        >
          {sending ? "Sending..." : "Send Email"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EmailSupportModal;