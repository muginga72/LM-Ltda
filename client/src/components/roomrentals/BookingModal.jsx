import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

export default function BookingModal({ show, onHide, room, onBooked }) {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [guests, setGuests] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (room) {
      setGuests(Math.min(room.roomCapacity || 1, 1));
      setStartDate("");
      setEndDate("");
      setError("");
    }
  }, [room]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("You must be signed in to book.");
      return;
    }
    if (!room) {
      setError("No room selected.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Start and end dates are required.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        roomId: room._id,
        startDate,
        endDate,
        guests
      };
      const res = await axios.post("/api/bookings", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onBooked?.(res.data);
    } catch (err) {
      console.error("Booking error:", err);
      setError(err?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book {room?.roomTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2" controlId="bookingGuests">
            <Form.Label>Guests</Form.Label>
            <Form.Control type="number" min={1} max={room?.roomCapacity || 1} value={guests} onChange={e => setGuests(Number(e.target.value))} />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-2" controlId="startDate">
                <Form.Label>Start date</Form.Label>
                <Form.Control type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2" controlId="endDate">
                <Form.Label>End date</Form.Label>
                <Form.Control type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={onHide} disabled={loading}>Cancel</Button>
            <Button variant="primary" type="submit" className="ms-2" disabled={loading}>{loading ? "Booking…" : "Book now"}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}