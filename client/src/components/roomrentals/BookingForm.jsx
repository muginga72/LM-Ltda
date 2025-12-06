// src/components/roomrental/BookingForm.jsx
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { checkAvailability, createBooking } from '../../api/bookingsApi';

export default function BookingForm({ roomId, roomTitle, onBooked }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [idFile, setIdFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!startDate || !endDate) {
      setStatus({ variant: 'danger', text: 'Select start and end dates.' });
      return;
    }
    setLoading(true);
    try {
      const data = await checkAvailability(roomId, startDate, endDate);
      if (data.available) {
        setStatus({ variant: 'success', text: 'Room is available. You can proceed to book.' });
      } else {
        setStatus({ variant: 'warning', text: 'Room is not available for selected dates.' });
      }
    } catch (err) {
      setStatus({ variant: 'danger', text: 'Availability check failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!startDate || !endDate || !dateOfBirth || !idFile) {
      setStatus({ variant: 'danger', text: 'All fields and ID upload are required.' });
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('roomId', roomId);
      fd.append('startDate', startDate);
      fd.append('endDate', endDate);
      fd.append('dateOfBirth', dateOfBirth);
      fd.append('guestsCount', guestsCount);
      fd.append('idDocument', idFile);

      const res = await createBooking(fd);
      if (res && (res.booking || res._id)) {
        setStatus({ variant: 'success', text: 'Booking created. Follow payment instructions if pending.' });
        if (res.paymentInstructions) setPaymentInstructions(res.paymentInstructions);
        onBooked && onBooked(res.booking || res);
      } else if (res && res.message) {
        setStatus({ variant: 'danger', text: res.message });
      } else {
        setStatus({ variant: 'danger', text: 'Booking failed.' });
      }
    } catch (err) {
      setStatus({ variant: 'danger', text: 'Network error while creating booking.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {status && <Alert variant={status.variant}>{status.text}</Alert>}

      <Form.Group className="mb-2">
        <Form.Label>Start date</Form.Label>
        <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>End date</Form.Label>
        <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </Form.Group>

      <div className="d-flex gap-2 mb-3">
        <Button variant="outline-primary" onClick={handleCheck} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Check availability'}
        </Button>
      </div>

      <hr />

      <Form.Group className="mb-2">
        <Form.Label>Date of birth</Form.Label>
        <Form.Control type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
        <Form.Text className="text-muted">Guest must be at least 18 years old.</Form.Text>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Guests</Form.Label>
        <Form.Control type="number" min="1" value={guestsCount} onChange={(e) => setGuestsCount(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Upload ID / Passport (JPEG, PNG, PDF)</Form.Label>
        <Form.Control type="file" accept="image/*,application/pdf" onChange={(e) => setIdFile(e.target.files[0])} />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Book & Hold 24h'}
        </Button>
      </div>

      {paymentInstructions && (
        <div className="mt-3">
          <h6>Payment Instructions</h6>
          <ul>
            <li><strong>Account:</strong> {paymentInstructions.accountNumber}</li>
            <li><strong>IBAN:</strong> {paymentInstructions.iban}</li>
            <li><strong>Branch:</strong> {paymentInstructions.branch}</li>
            <li>{paymentInstructions.note}</li>
          </ul>
        </div>
      )}
    </Form>
  );
}