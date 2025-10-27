import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Alert, Spinner, ProgressBar, Image } from "react-bootstrap";
import axios from "axios";

const RAW_API = process.env.REACT_APP_API_URL || "";
const API = RAW_API.replace(/\/+$/, "");

/**
 * Props
 * - service: object (required) — the service being paid for
 * - onHide: function (optional) — called when modal closes
 * - refresh: function (optional) — called after successful upload
 * - currentUser: object (optional) — { email, fullName } used to auto-fill payerEmail/payerName
 */

function UploadProofModal({ service, onHide, refresh, currentUser }) {
  const [show, setShow] = useState(!!service);
  useEffect(() => setShow(!!service), [service]);

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [payerName, setPayerName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [method, setMethod] = useState("");
  const [dateReceived, setDateReceived] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Auto-fill from currentUser when modal opens
    if (show && currentUser) {
      if (currentUser.email) setPayerEmail(currentUser.email);
      if (currentUser.fullName) setPayerName((n) => n || currentUser.fullName);
    }
    // reset small state when opening
    if (show) {
      setStatus("");
      setProgress(0);
    }
  }, [show, currentUser]);

  useEffect(() => {
    // cleanup preview URL on unmount or file change
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  if (!service) return null;

  // Validate accepted types and max size (10MB)
  const isValidFile = (f) => {
    if (!f) return false;
    const allowed = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    const maxBytes = 10 * 1024 * 1024;
    return allowed.includes(f.type) && f.size <= maxBytes;
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setFile(null);
      setFilePreview(null);
      return;
    }
    if (!isValidFile(f)) {
      setStatus("Invalid file. Accepts PNG/JPEG/PDF up to 10MB.");
      setFile(null);
      setFilePreview(null);
      // clear file input
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFile(f);
    setStatus("");
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!payerEmail) return setStatus("Please provide an email.");
    if (!file) return setStatus("Please attach proof (image or PDF).");

    const fd = new FormData();
    fd.append("serviceId", service._id);
    fd.append("payerName", payerName);
    fd.append("payerEmail", payerEmail);
    fd.append("amountPaid", amountPaid);
    fd.append("submissionMethod", method);
    fd.append("dateReceived", dateReceived || new Date().toISOString());
    fd.append("referenceId", referenceId);
    fd.append("proof", file);

    setSending(true);
    setStatus("");
    setProgress(0);

    try {
      await axios.post(`${API}/api/payments/upload-proof`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setProgress(pct);
        },
        timeout: 120000,
      });

      setStatus("Proof uploaded and admin notified.");
      if (typeof refresh === "function") refresh();

      // small success UX: keep progress at 100% briefly
      setProgress(100);
      setTimeout(() => {
        setShow(false);
        onHide && onHide();
        // reset form state
        setFile(null);
        setFilePreview(null);
        setPayerName("");
        setPayerEmail(currentUser?.email || "");
        setAmountPaid("");
        setMethod("");
        setDateReceived("");
        setReferenceId("");
        setStatus("");
        setProgress(0);
      }, 800);
    } catch (err) {
      console.error("Upload error:", err);
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Upload failed, please try again.";
      setStatus(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        onHide && onHide();
      }}
      centered
      // size="lg"
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Payment Proof — {service.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Control
              placeholder="Your name (optional) e.g. Jane Doe"
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              type="email"
              placeholder="Your email e.g. jane@example.com"
              value={payerEmail}
              onChange={(e) => setPayerEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              type="number"
              step="0.01"
              placeholder="Amount paid e.g. 49.99"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Control
              placeholder="e.g. Bank transfer, PayPal, etc."
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Date received</Form.Label>
            <Form.Control
              type="date"
              value={dateReceived}
              onChange={(e) => setDateReceived(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Reference/transaction ID</Form.Label>
            <Form.Control
              placeholder="e.g. TXN123456789"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Proof file (PNG, JPG, or PDF; max 10MB)</Form.Label>
            <Form.Control
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
          </Form.Group>

          {filePreview && (
            <div className="mb-3">
              <Form.Label>Preview</Form.Label>
              <div>
                <Image src={filePreview} thumbnail style={{ maxHeight: 240 }} />
              </div>
            </div>
          )}

          {progress > 0 && (
            <div className="mb-2">
              <ProgressBar now={progress} label={`${progress}%`} />
            </div>
          )}

          {status && (
            <Alert
              variant={status.toLowerCase().includes("failed") ? "danger" : "info"}
              className="mt-2"
            >
              {status}
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShow(false);
              onHide && onHide();
            }}
            disabled={sending}
          >
            Close
          </Button>

          <Button variant="primary" type="submit" disabled={sending}>
            {sending ? (
              <>
                <Spinner size="sm" animation="border" /> Sending...
              </>
            ) : (
              "Send Proof"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UploadProofModal;