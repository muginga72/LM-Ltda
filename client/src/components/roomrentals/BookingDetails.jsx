// src/components/BookingDetails.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

const PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'>
      <rect width='100%' height='100%' fill='#f3f3f3'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-size='20'>No image available</text>
    </svg>`
  );

function resolveFirstImage(images) {
  if (!images) return null;
  if (Array.isArray(images)) {
    for (const img of images) {
      const url = resolveImageUrl(img);
      if (url) return url;
    }
    return null;
  }
  return resolveImageUrl(images);
}

function resolveImageUrl(img) {
  try {
    if (!img) return null;
    if (typeof img === 'string') {
      return img;
    }
    if (img.url && typeof img.url === 'string') return img.url;
    if (img.filename && typeof img.filename === 'string') return `/uploads/rooms/${img.filename}`;
    return null;
  } catch {
    return null;
  }
}

export default function BookingDetails({ booking, onClose }) {
  if (!booking) return null;

  const start = booking.startDate ? new Date(booking.startDate).toLocaleDateString() : '—';
  const end = booking.endDate ? new Date(booking.endDate).toLocaleDateString() : '—';
  const imageUrl = resolveFirstImage(booking.room?.images) || PLACEHOLDER;

  return (
    <Modal show={!!booking} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Booking {booking._id}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Top image to attract the user */}
        <div className="mb-3" style={{ textAlign: 'center' }}>
          <img
            src={imageUrl}
            alt={booking.room?.roomTitle || 'Room image'}
            style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 24 }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
            }}
          />
        </div>

        <p><strong>Room:</strong> {booking.room?.roomTitle || booking.room?.title || '—'}</p>
        <p><strong>Dates:</strong> {start} — {end} ({booking.nights ?? '—'} nights)</p>
        <p><strong>Guest:</strong> {booking.guest?.name || booking.guest?._id || '—'}</p>
        <p><strong>Status:</strong> {booking.status || '—'}</p>
        <p>
          <strong>Total:</strong>{' '}
          {booking.totalPrice?.amount ?? booking.totalAmount ?? '—'}{' '}
          {booking.totalPrice?.currency ?? booking.currency ?? ''}
        </p>

        {booking.idDocument && (
          <p>
            <strong>ID uploaded:</strong>{' '}
            {booking.idDocument.originalName || booking.idDocument.filename || 'uploaded file'}
          </p>
        )}

        {booking.expiresAt && (
          <p><strong>Expires at:</strong> {new Date(booking.expiresAt).toLocaleString()}</p>
        )}

        {booking.notes && (
          <p><strong>Notes:</strong> {booking.notes}</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

BookingDetails.propTypes = {
  booking: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

BookingDetails.defaultProps = {
  booking: null,
};