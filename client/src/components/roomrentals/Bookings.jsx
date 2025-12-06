// src/components/roomrental/Bookings.jsx
import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { listMyBookings, cancelBooking, getBooking } from '../../api/bookingsApi';
import BookingListItem from './BookingListItem';
import BookingDetails from './BookingDetails';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMyBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (booking) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(booking._id);
      await load();
    } catch (err) {
      alert('Cancel failed');
    }
  };

  const handleView = async (booking) => {
    try {
      const data = await getBooking(booking._id);
      setSelected(data);
    } catch (err) {
      alert('Failed to load booking details');
    }
  };

  return (
    <Container>
      <h3 className="mb-3">My Bookings</h3>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && bookings.length === 0 && <div>No bookings yet.</div>}
      {bookings.map(b => (
        <BookingListItem key={b._id} booking={b} onCancel={handleCancel} onView={handleView} />
      ))}

      {selected && <BookingDetails booking={selected} onClose={() => setSelected(null)} />}
    </Container>
  );
}