import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, Alert, ProgressBar } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

export default function RequestListRoomModal({ show, onHide, onSubmitted }) {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Image upload state
  const [images, setImages] = useState([]); // File objects
  const [previews, setPreviews] = useState([]); // { url, name, size }
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrls, setUploadedUrls] = useState([]); // server-returned URLs

  // Create previews when images change
  useEffect(() => {
    // cleanup old object URLs
    previews.forEach(p => p.url && URL.revokeObjectURL(p.url));
    if (!images || images.length === 0) {
      setPreviews([]);
      return;
    }
    const next = images.map((f) => {
      const isImage = f.type && f.type.startsWith("image/");
      return {
        url: isImage ? URL.createObjectURL(f) : null,
        name: f.name,
        size: f.size,
        type: f.type,
      };
    });
    setPreviews(next);

    return () => {
      next.forEach(p => p.url && URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // Validate file types and set images
  function handleImagesChange(e) {
    setError("");
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      setImages([]);
      setUploadedUrls([]);
      return;
    }

    // Allowed types: images only for room images
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const invalid = files.find(f => !allowed.includes(f.type));
    if (invalid) {
      setError("Only JPEG, PNG, WEBP or GIF images are allowed for room photos.");
      return;
    }

    // Optional: limit number of images
    const MAX = 8;
    if (files.length > MAX) {
      setError(`You can upload up to ${MAX} images.`);
      return;
    }

    setImages(files);
    setUploadedUrls([]);
  }

  // Upload images to server and return array of URLs
  async function uploadImages() {
    if (!images || images.length === 0) return [];

    const form = new FormData();
    images.forEach((f) => form.append("roomImages", f)); // server expects field "roomImages"

    setUploading(true);
    setUploadProgress(0);
    setError("");

    try {
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

      // Parse server response. Accept several shapes for robustness.
      // Preferred: res.data.files.roomImages -> array of { url, filename }
      const filesObj = res.data?.files || res.data;
      let roomFiles = null;

      if (filesObj && filesObj.roomImages) {
        roomFiles = filesObj.roomImages;
      } else if (Array.isArray(res.data)) {
        // sometimes server returns array
        roomFiles = res.data;
      } else if (res.data?.uploaded) {
        // fallback shape
        roomFiles = res.data.uploaded;
      }

      // Extract URLs
      const urls = Array.isArray(roomFiles)
        ? roomFiles.map(f => f.url || f.path || (f.filename ? `/uploads/${f.filename}` : null)).filter(Boolean)
        : [];

      if (urls.length === 0) {
        // Try other common fields
        const singleUrl = res.data?.url || res.data?.filePath || res.data?.path;
        if (singleUrl) urls.push(singleUrl);
      }

      if (urls.length === 0) {
        throw new Error("Upload succeeded but server did not return file URLs.");
      }

      setUploadedUrls(urls);
      return urls;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to upload images";
      throw new Error(msg);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  // Submit request: upload images first (if any), then send request payload
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("You must be signed in to submit a request.");
      return;
    }
    if (!title) {
      setError("Please add a short title for your request.");
      return;
    }

    setLoading(true);
    try {
      // Upload images if present and not already uploaded
      let imageUrls = uploadedUrls;
      if (images.length > 0 && imageUrls.length === 0) {
        try {
          imageUrls = await uploadImages();
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr);
          setError(uploadErr.message || "Failed to upload images");
          setLoading(false);
          return;
        }
      }

      const payload = {
        title,
        details,
        preferredLocation: location,
        contact,
        images: imageUrls, // include image URLs (may be empty array)
      };

      await axios.post("/api/room-requests", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Request submitted. We'll review it and follow up.");
      setTitle("");
      setDetails("");
      setLocation("");
      setImages([]);
      setUploadedUrls([]);
      onSubmitted?.();
    } catch (err) {
      console.error("Request error:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  }

  // Remove a selected image before upload
  function removeImage(index) {
    const next = images.slice();
    next.splice(index, 1);
    setImages(next);
    setUploadedUrls([]);
  }

  // Reset when modal closes
  useEffect(() => {
    if (!show) {
      setError("");
      setSuccess("");
      setTitle("");
      setDetails("");
      setLocation("");
      setImages([]);
      setUploadedUrls([]);
      setUploading(false);
      setUploadProgress(0);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Request a New Listing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Short title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Large 2BR near downtown"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what you're requesting"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Preferred location</Form.Label>
            <Form.Control
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, neighbourhood, or address"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Contact email</Form.Label>
            <Form.Control type="email" value={contact} onChange={(e) => setContact(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Room photos</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              required
              onChange={handleImagesChange}
            />
            {previews.length > 0 && (
              <div className="mt-2" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {previews.map((p, i) => (
                  <div key={i} style={{ width: 120, textAlign: "center" }}>
                    {p.url ? (
                      <img
                        src={p.url}
                        alt={p.name}
                        style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6 }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: 80, background: "#f0f0f0", borderRadius: 6 }} />
                    )}
                    <div style={{ fontSize: 12, marginTop: 6 }}>
                      <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div className="text-muted">{Math.round(p.size / 1024)} KB</div>
                      <Button variant="link" size="sm" onClick={() => removeImage(i)}>Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Form.Group>

          {uploading && (
            <div className="mb-2">
              <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
            </div>
          )}

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={onHide} disabled={loading || uploading}>Cancel</Button>
            <Button variant="primary" type="submit" className="ms-2" disabled={loading || uploading}>
              {loading ? "Sending…" : "Send request"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}