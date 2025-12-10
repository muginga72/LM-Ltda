import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

/**
 * BookingForm: small, focused booking form that POSTs to /api/bookings (fallback /bookings).
 * - onBooked(createdBooking) is called when booking is created successfully.
 * - onCancel() closes the form without creating a booking.
 */
function BookingForm({
  room,
  user,
  token,
  apiBaseUrl,
  headers = {},
  onBooked,
  onCancel,
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(
    room?.roomCapacity || room?.capacity || 1
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authToken =
    token || user?.token || localStorage.getItem("authToken") || null;
  const defaultHeaders = {
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    "Cache-Control": "no-cache",
    ...headers,
  };

  const buildUrl = (path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    if (!apiBaseUrl) return normalizedPath;
    const base = apiBaseUrl.replace(/\/+$/, "");
    return `${base}${normalizedPath}`;
  };

  const validate = () => {
    setError(null);
    if (!startDate || !endDate) {
      setError("Please select start and end dates.");
      return false;
    }
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      setError("Invalid dates.");
      return false;
    }
    if (e < s) {
      setError("End date must be the same or after start date.");
      return false;
    }
    if (guests < 1) {
      setError("Guests must be at least 1.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);

    const payload = {
      roomId: room._id,
      roomTitle: room.roomTitle || room.title || room.name || "",
      startDate,
      endDate,
      guests,
      userId: user?._id || null,
      userEmail: user?.email || null,
    };

    const candidates = ["/api/bookings", "/bookings"];

    try {
      let created = null;
      for (const path of candidates) {
        try {
          const res = await axios.post(buildUrl(path), payload, {
            headers: { "Content-Type": "application/json", ...defaultHeaders },
          });
          created = res?.data;
          break;
        } catch (err) {
          const status = err?.response?.status;
          if (status === 404) {
            continue;
          } else {
            throw err;
          }
        }
      }

      if (!created) {
        throw new Error("No bookings endpoint accepted the request (404).");
      }

      onBooked && onBooked(created);
    } catch (err) {
      console.error("Booking create error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Failed to create booking. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-2">
        <label className="form-label">Start date</label>
        <input
          className="form-control"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="form-label">End date</label>
        <input
          className="form-control"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Guests</label>
        <input
          className="form-control"
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Book room"}
        </Button>
      </div>
    </form>
  );
}

export default BookingForm;