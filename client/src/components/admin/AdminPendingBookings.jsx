// src/components/admin/AdminPendingBookings.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { listPendingBookingsAdmin, confirmBookingAdmin } from '../../api/bookingsApi';

export default function AdminPendingBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPendingBookingsAdmin();
      setBookings(data);
    } catch (err) {
      setError('Failed to load pending bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleConfirm = (b) => {
    setSelected(b);
  };

  const doConfirm = async () => {
    if (!selected) return;
    setConfirming(true);
    try {
      await confirmBookingAdmin(selected._id);
      setSelected(null);
      await load();
    } catch (err) {
      alert('Confirm failed');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div>
      <h3>Pending Bookings (Admin)</h3>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && bookings.length === 0 && <div>No pending bookings.</div>}
      {bookings.length > 0 && (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Room</th>
              <th>User</th>
              <th>Dates</th>
              <th>Total</th>
              <th>Expires At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{b._id}</td>
                <td>{b.room?.roomTitle}</td>
                <td>{b.guest?.email || b.guest?._id}</td>
                <td>{new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}</td>
                <td>{b.totalPrice?.amount || b.totalAmount} {b.totalPrice?.currency || b.currency}</td>
                <td>{new Date(b.expiresAt).toLocaleString()}</td>
                <td>
                  <Button size="sm" variant="success" onClick={() => handleConfirm(b)}>Confirm</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={!!selected} onHide={() => setSelected(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Mark booking <strong>{selected?._id}</strong> as paid and confirmed?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelected(null)}>Cancel</Button>
          <Button variant="primary" onClick={doConfirm} disabled={confirming}>
            {confirming ? 'Confirming...' : 'Confirm Payment'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}