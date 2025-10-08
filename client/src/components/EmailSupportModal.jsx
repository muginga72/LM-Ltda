// components/EmailSupportModal.jsx
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const EmailSupportModal = ({ show, handleClose, userEmail }) => {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  const handleSendEmail = async () => {
    setSending(true);
    try {
      const res = await fetch('/api/send-payment-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      setStatus(data.message);
    } catch (err) {
      setStatus('Failed to send email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Support Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Click below to notify support and begin payment verification.</p>
        {status && <p className="text-info">{status}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleSendEmail} disabled={sending}>
          {sending ? 'Sending...' : 'Send Email'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmailSupportModal;