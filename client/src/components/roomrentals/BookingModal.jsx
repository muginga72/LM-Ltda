import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert, ProgressBar } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

export default function BookingModal({ show, onHide, room, onBooked }) {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [guests, setGuests] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // File upload state
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // uploadedFileRef stores the server-returned public URL (e.g., /uploads/ids/12345.jpg)
  const [uploadedFileRef, setUploadedFileRef] = useState(null);

  // Reset modal state when room changes or modal is opened
  useEffect(() => {
    if (room) {
      setGuests(1);
      setStartDate("");
      setEndDate("");
      setError("");
      setFile(null);
      setFilePreview(null);
      setUploading(false);
      setUploadProgress(0);
      setUploadedFileRef(null);
    }
  }, [room, show]);

  // Create/revoke preview URL for image files
  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }
    if (file.type && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreview(null);
    }
  }, [file]);

  // Upload single ID/passport file to server using field name "id"
async function uploadIdFile() {
  if (!file) return null;

  const form = new FormData();
  // server expects field name "id"
  form.append("id", file);

  setUploading(true);
  setUploadProgress(0);
  setError("");

  try {
    // If backend runs on a different port, use full URL or configure proxy
    const res = await axios.post("/api/uploads/upload-docs", form, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        if (!total) return;
        setUploadProgress(Math.round((loaded * 100) / total));
      },
    });

    // Expect server: { success: true, files: { id: [{ url, filename, ... }] } }
    const idFiles = res.data?.files?.id;
    const first = Array.isArray(idFiles) && idFiles.length ? idFiles[0] : null;
    const url = first?.url || first?.path || (first?.filename ? `/uploads/${first.filename}` : null);

    if (!url) throw new Error("Upload succeeded but server did not return file URL");

    setUploadedFileRef(url);
    return url;
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Failed to upload ID file";
    throw new Error(msg);
  } finally {
    setUploading(false);
    setUploadProgress(0);
  }
}

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("You must be signed in to book.");
      return;
    }
    if (!room) {
      setError("No room selected.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Start and end dates are required.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date.");
      return;
    }

    setLoading(true);
    try {
      // Upload ID if provided and not already uploaded
      let idFileRef = uploadedFileRef;
      if (file && !idFileRef) {
        try {
          idFileRef = await uploadIdFile();
        } catch (uploadErr) {
          console.error("Upload failed:", uploadErr);
          setError(uploadErr.message || "Failed to upload ID file");
          setLoading(false);
          return;
        }
      }

      // Build booking payload
      const payload = {
        roomId: room._id,
        startDate,
        endDate,
        guests,
        idFile: idFileRef || null, // server expects public URL or null
      };

      const res = await axios.post("/api/bookings", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onBooked?.(res.data);

      // cleanup and close
      setFile(null);
      setFilePreview(null);
      setUploadedFileRef(null);
      onHide();
    } catch (err) {
      console.error("Booking error:", err);
      setError(err?.response?.data?.message || err?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0] || null;
    if (!f) {
      setFile(null);
      setFilePreview(null);
      return;
    }
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(f.type)) {
      setError("Only JPEG, PNG, WEBP images or PDFs are allowed for ID");
      return;
    }
    setError("");
    setFile(f);
    setUploadedFileRef(null);
  }

  // Reset state when modal closes
  useEffect(() => {
    if (!show) {
      setError("");
      setFile(null);
      setFilePreview(null);
      setUploading(false);
      setUploadProgress(0);
      setUploadedFileRef(null);
      setLoading(false);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book {room?.roomTitle || "room"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2" controlId="bookingGuests">
            <Form.Label>Guests</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={room?.roomCapacity || 1}
              value={guests}
              onChange={(e) => setGuests(Math.max(1, Number(e.target.value || 1)))}
            />
            <Form.Text className="text-muted">
              Max capacity: {room?.roomCapacity ?? "N/A"}
            </Form.Text>
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-2" controlId="startDate">
                <Form.Label>Start date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2" controlId="endDate">
                <Form.Label>End date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />

          <Form.Group className="mb-2" controlId="idFile">
            <Form.Label>Government ID or Passport</Form.Label>
            <Form.Control
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
            {file && (
              <div className="mt-2">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="ID preview"
                    style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 6 }}
                  />
                ) : (
                  <div>
                    <strong>{file.name}</strong>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      {(file.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                )}
              </div>
            )}

            {uploading && (
              <div className="mt-2">
                <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
              </div>
            )}

            {uploadedFileRef && (
              <div className="mt-2 text-success">
                ID uploaded:{" "}
                <a href={uploadedFileRef} target="_blank" rel="noreferrer">
                  View
                </a>
              </div>
            )}
          </Form.Group>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={onHide} disabled={loading || uploading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="ms-2"
              disabled={loading || uploading}
            >
              {loading ? "Booking…" : "Book now"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}