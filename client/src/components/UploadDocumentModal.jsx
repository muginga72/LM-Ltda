import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

function UploadDocumentModal({ show, handleClose, serviceId, user }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedLocation, setUploadedLocation] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("serviceId", serviceId);
      formData.append("userEmail", user.email);

      const res = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      setUploadedLocation(res.data.filePath);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Payment Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Please upload your payment confirmation document (screenshot, PDF, or
          receipt).
        </p>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        {uploading && (
          <div className="text-center mt-3">
            <Spinner animation="border" />
          </div>
        )}
        {uploadedLocation && (
          <Alert variant="success" className="mt-3">
            File uploaded successfully! <br />
            Location: <code>{uploadedLocation}</code>
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpload} disabled={uploading}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UploadDocumentModal;