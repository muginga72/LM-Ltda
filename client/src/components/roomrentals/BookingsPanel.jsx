// src/components/BookingsPanel.jsx
import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert, ListGroup, Button } from "react-bootstrap";
import axios from "axios";

/**
 * BookingsPanel
 *
 * Props:
 * - apiBaseUrl: optional base URL (e.g., "http://localhost:5000")
 * - token: optional auth token (Bearer)
 * - userId: optional user id (fallback if /api/bookings/my not available)
 *
 * Behavior:
 * - First attempts GET `${base}/api/bookings/my` with Authorization header (if token).
 * - If that returns 404, falls back to GET `${base}/api/bookings?userId=${userId}`.
 * - If both fail, surfaces the server message.
 */
export default function BookingsPanel({ apiBaseUrl = "", token = "", userId = "" }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const base = apiBaseUrl ? apiBaseUrl.replace(/\/$/, "") : "";

  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      setLoading(true);
      setError("");
      setBookings([]);

      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      // Try the convenient authenticated route first
      const tryMyUrl = `${base}/api/bookings/my`;
      const fallbackUrl = userId ? `${base}/api/bookings?userId=${encodeURIComponent(userId)}` : `${base}/api/bookings`;

      try {
        const res = await axios.get(tryMyUrl, { headers });
        if (!cancelled) {
          setBookings(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        // If 404, try fallback; otherwise show error
        const status = err.response?.status;
        if (status === 404) {
          try {
            const res2 = await axios.get(fallbackUrl, { headers });
            if (!cancelled) {
              setBookings(Array.isArray(res2.data) ? res2.data : []);
            }
          } catch (err2) {
            if (!cancelled) {
              console.error("Bookings fallback error:", err2);
              setError(extractMessage(err2) || "Failed to load bookings.");
            }
          }
        } else {
          if (!cancelled) {
            console.error("Bookings error:", err);
            setError(extractMessage(err) || "Failed to load bookings.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, token, userId]);

  function extractMessage(err) {
    const data = err.response?.data;
    if (!data) return err.message;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    return JSON.stringify(data);
  }

  if (loading) {
    return (
      <Container className="py-3 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-3">
      <h5>Your Bookings</h5>

      {error && <Alert variant="danger">{error}</Alert>}

      {!error && bookings.length === 0 && <Alert variant="info">No bookings found.</Alert>}

      {bookings.length > 0 && (
        <ListGroup>
          {bookings.map((b) => (
            <ListGroup.Item key={b._id || b.id || `${b.roomId}-${b.startDate}`}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{b.roomName || b.roomId || "Room"}</strong>
                  <div className="text-muted">
                    {b.startDate ? `From: ${formatDate(b.startDate)}` : ""}
                    {b.endDate ? ` — To: ${formatDate(b.endDate)}` : ""}
                  </div>
                  {b.guestsCount ? <div>Guests: {b.guestsCount}</div> : null}
                </div>
                <div className="text-end">
                  <small className="text-muted">{b.status || ""}</small>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString();
}