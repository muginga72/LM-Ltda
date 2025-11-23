import React, { useState, useContext } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

export default function RequestListRoomModal({ show, onHide, onSubmitted }) {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!token) {
      setError("You must be signed in to submit a request.");
      return;
    }
    if (!title) {
      setError("Please add a short title for your request.");
      return;
    }

    setLoading(true);
    try {
      const payload = { title, details, preferredLocation: location, contact };
      await axios.post("/api/room-requests", payload, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess("Request submitted. We'll review it and follow up.");
      setTitle(""); setDetails(""); setLocation("");
      onSubmitted?.();
    } catch (err) {
      console.error("Request error:", err);
      setError(err?.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Request a New Listing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Short title</Form.Label>
            <Form.Control value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Large 2BR near downtown" required />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Details</Form.Label>
            <Form.Control as="textarea" rows={3} value={details} onChange={e => setDetails(e.target.value)} placeholder="Describe what you're requesting" />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Preferred location</Form.Label>
            <Form.Control value={location} onChange={e => setLocation(e.target.value)} placeholder="City, neighbourhood, or address" />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Contact email</Form.Label>
            <Form.Control type="email" value={contact} onChange={e => setContact(e.target.value)} />
          </Form.Group>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={onHide} disabled={loading}>Cancel</Button>
            <Button variant="primary" type="submit" className="ms-2" disabled={loading}>{loading ? "Sending…" : "Send request"}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}