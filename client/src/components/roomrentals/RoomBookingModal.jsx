import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

export default function RoomBookingModal({ show, onHide, room, apiBaseUrl, token, userId }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [idFile, setIdFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setIdFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!idFile) return setError("Please upload an ID document");
    if (!startDate || !endDate) return setError("Please select start and end dates");
    if (!dateOfBirth) return setError("Please enter date of birth");

    const form = new FormData();
    form.append("roomId", room._id || room.id || room.id);
    form.append("startDate", new Date(startDate).toISOString());
    form.append("endDate", new Date(endDate).toISOString());
    form.append("dateOfBirth", new Date(dateOfBirth).toISOString());
    form.append("guestsCount", String(guestsCount));
    form.append("idDocument", idFile);

    setLoading(true);
    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/bookings`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // success handling
      alert("Booking successful");
      onHide();
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Book {room?.name || "room"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-2">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Guests</Form.Label>
            <Form.Control type="number" min="1" value={guestsCount} onChange={(e) => setGuestsCount(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>ID Document (passport or government ID)</Form.Label>
            <Form.Control type="file" accept="image/*,application/pdf" onChange={handleFileChange} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>{loading ? "Booking..." : "Book"}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}