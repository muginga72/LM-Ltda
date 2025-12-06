// src/components/roomrental/BookingListItem.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';

export default function BookingListItem({ booking, onCancel, onView }) {
  const start = new Date(booking.startDate).toLocaleDateString();
  const end = new Date(booking.endDate).toLocaleDateString();
  const expires = booking.expiresAt ? new Date(booking.expiresAt).toLocaleString() : null;

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div>
            <h5>{booking.room?.roomTitle || 'Room'}</h5>
            <div>{start} — {end} ({booking.nights} nights)</div>
            <div className="text-muted">Total: {booking.totalPrice?.amount || booking.totalAmount} {booking.totalPrice?.currency || booking.currency}</div>
            <div className="mt-1"><strong>Status:</strong> {booking.status}</div>
            {expires && booking.status === 'pending' && <div className="text-warning">Expires at: {expires}</div>}
          </div>
          <div className="d-flex flex-column gap-2">
            <Button variant="outline-secondary" size="sm" onClick={() => onView(booking)}>View</Button>
            {booking.status !== 'cancelled' && booking.status !== 'confirmed' && (
              <Button variant="danger" size="sm" onClick={() => onCancel(booking)}>Cancel</Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}