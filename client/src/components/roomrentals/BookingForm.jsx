// BookingForm.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";

function BookingForm({ show, onHide, room, userId, token, apiBaseUrl = "" }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!show) {
      setStartDate("");
      setEndDate("");
      setGuestsCount(1);
      setSelectedFile(null);
      setError("");
      setLoading(false);
    }
  }, [show]);

  const validate = () => {
    setError("");
    const roomId = room?._id || room?.id;
    if (!roomId) {
      setError("No room selected.");
      return false;
    }
    if (!userId) {
      setError("No user id available. Please sign in.");
      return false;
    }
    if (!startDate || !endDate) {
      setError("Start date and end date are required.");
      return false;
    }
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      setError("Invalid date format.");
      return false;
    }
    if (s > e) {
      setError("Start date must be before or equal to end date.");
      return false;
    }
    if (!Number.isInteger(Number(guestsCount)) || Number(guestsCount) < 1) {
      setError("Guests must be a positive integer.");
      return false;
    }
    return true;
  };

  const parseServerResponse = async (res) => {
    try {
      return await res.json();
    } catch {
      try {
        return await res.text();
      } catch {
        return null;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    const roomId = room._id || room.id;
    const base = apiBaseUrl ? apiBaseUrl.replace(/\/$/, "") : "";
    const url = base ? `${base}/api/bookings` : "/api/bookings";

    try {
      setLoading(true);

      // If a file is selected, send multipart/form-data
      if (selectedFile) {
        const formData = new FormData();
        formData.append("roomId", roomId);
        formData.append("userId", userId);
        formData.append("startDate", startDate); // send as YYYY-MM-DD
        formData.append("endDate", endDate);
        formData.append("guestsCount", String(guestsCount));
        formData.append("idDocument", selectedFile);

        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(url, {
          method: "POST",
          headers,
          body: formData,
        });

        const body = await parseServerResponse(res);
        if (!res.ok) {
          const msg = (body && (body.message || body.error)) || `Server responded with ${res.status}`;
          throw new Error(msg);
        }

        onHide();
        return;
      }

      // No file: send JSON
      const payload = {
        roomId,
        userId,
        startDate,
        endDate,
        guestsCount: Number(guestsCount),
      };

      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const body = await parseServerResponse(res);
      if (!res.ok) {
        const msg = (body && (body.message || body.error)) || `Server responded with ${res.status}`;
        throw new Error(msg);
      }

      onHide();
    } catch (err) {
      console.error("Booking failed:", err);
      setError(err.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={() => { if (!loading) onHide(); }} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Book {room?.name || "Room"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3" controlId="bookingStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="bookingEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="bookingGuests">
            <Form.Label>Guests</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={guestsCount}
              onChange={(e) => setGuestsCount(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="bookingIdDocument">
            <Form.Label>ID Document (optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
            {selectedFile && (
              <div className="mt-2">
                <small>Selected file: <strong>{selectedFile.name}</strong></small>
              </div>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => { if (!loading) onHide(); }} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Confirm Booking"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default BookingForm;