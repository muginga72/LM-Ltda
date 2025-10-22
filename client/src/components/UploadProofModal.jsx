// components/UploadProofModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function UploadProofModal({ service, onHide, refresh }) {
  const [show, setShow] = useState(!!service);
  useEffect(()=> setShow(!!service), [service]);

  const [file, setFile] = useState(null);
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [method, setMethod] = useState('');
  const [dateReceived, setDateReceived] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  if (!service) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!payerEmail) return setStatus('Please provide an email.');
    const fd = new FormData();
    fd.append('serviceId', service._id);
    fd.append('payerName', payerName);
    fd.append('payerEmail', payerEmail);
    fd.append('amountPaid', amountPaid);
    fd.append('submissionMethod', method);
    fd.append('dateReceived', dateReceived || new Date().toISOString());
    fd.append('referenceId', referenceId);
    if (file) fd.append('proof', file);

    setSending(true); setStatus('');
    try {
      const res = await axios.post(`${API}/api/payments/upload-proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus('Proof uploaded and admin notified.');
      if (typeof refresh === 'function') refresh();
      setTimeout(()=> { setShow(false); onHide && onHide(); }, 900);
    } catch (err) {
      console.error(err);
      setStatus('Upload failed.');
    } finally { setSending(false); }
  };

  return (
    <Modal show={show} onHide={()=> { setShow(false); onHide && onHide(); }} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton><Modal.Title>Upload Payment Proof — {service.title}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2"><Form.Label>Your name (optional)</Form.Label><Form.Control value={payerName} onChange={e=> setPayerName(e.target.value)} /></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Your email</Form.Label><Form.Control type="email" value={payerEmail} onChange={e=> setPayerEmail(e.target.value)} required /></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Amount paid</Form.Label><Form.Control type="number" step="0.01" value={amountPaid} onChange={e=> setAmountPaid(e.target.value)} /></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Submission method</Form.Label><Form.Control value={method} onChange={e=> setMethod(e.target.value)} placeholder="Bank transfer, PayPal..." /></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Date received</Form.Label><Form.Control type="date" value={dateReceived} onChange={e=> setDateReceived(e.target.value)} /></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Reference/transaction id</Form.Label><Form.Control value={referenceId} onChange={e=> setReferenceId(e.target.value)} /></Form.Group>
          <Form.Group className="mb-2"><Form.Label>Proof file (image or PDF)</Form.Label><Form.Control type="file" accept="image/*,application/pdf" onChange={e=> setFile(e.target.files[0])} /></Form.Group>
          {status && <Alert variant="info" className="mt-2">{status}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=> { setShow(false); onHide && onHide(); }}>Close</Button>
          <Button variant="primary" type="submit" disabled={sending}>{sending ? <><Spinner size="sm" animation="border" /> Sending...</> : 'Send Proof'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UploadProofModal;