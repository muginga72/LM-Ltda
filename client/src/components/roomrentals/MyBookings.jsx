// src/components/roomrentals/MyBookings.jsx
import React, { useEffect, useState, useContext } from "react";
import { Table, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

export default function MyBookings({ refreshKey }) {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/bookings/my", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setBookings(data);
      } catch (err) {
        console.error("Failed to load bookings", err);
        if (!mounted) return;
        setError(err?.response?.data?.message || "Unable to load bookings");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [token, refreshKey]);

  async function handleCancel(bookingId) {
    if (!window.confirm("Cancel this booking?")) return;
    setActionLoading(bookingId);
    try {
      await axios.delete(`/api/bookings/${bookingId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) {
      console.error("Cancel booking error", err);
      alert(err?.response?.data?.message || "Failed to cancel booking");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) return <div className="text-center py-4"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!bookings.length) return <Alert variant="info">You have no bookings.</Alert>;

  return (
    <div>
      <h5 className="mb-3">My bookings</h5>
      <Table hover responsive>
        <thead>
          <tr>
            <th>Room</th>
            <th>Dates</th>
            <th>Guests</th>
            <th>Price</th>
            <th>Status</th>
            <th style={{ minWidth: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => {
            const room = b.room || {};
            const price = room.pricePerNight ? `${room.pricePerNight.amount} ${room.pricePerNight.currency}` : "-";
            const dates = `${new Date(b.startDate).toLocaleDateString()} → ${new Date(b.endDate).toLocaleDateString()}`;
            return (
              <tr key={b._id}>
                <td>
                  <a href={`/rooms/${room._id}`} target="_self" rel="noreferrer">{room.roomTitle || "Room"}</a>
                  <div style={{ fontSize: 12, color: "#666" }}>{room.roomLocation?.city || ""}</div>
                </td>
                <td>{dates}</td>
                <td>{b.guests}</td>
                <td>{price}</td>
                <td style={{ textTransform: "capitalize" }}>{b.status || "pending"}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-secondary" href={`/rooms/${room._id}`}>Details</Button>
                    {b.status !== "cancelled" && b.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancel(b._id)}
                        disabled={actionLoading === b._id}
                      >
                        {actionLoading === b._id ? "Cancelling…" : "Cancel"}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}