import React, { useState, useContext, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  InputGroup,
  Badge,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { createRoom } from "../../api/roomsApi";

function RoomForm({ onCreated, onCancel }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const token = user?.token || localStorage.getItem("authToken") || null;

  const role =
    user?.role ||
    (() => {
      if (!token) return null;
      try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = JSON.parse(
          atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        return payload.role || payload.roles || null;
      } catch {
        return null;
      }
    })();

  const isAdmin = role === "admin";

  const [form, setForm] = useState({
    roomTitle: "",
    roomDescription: "",
    roomCapacity: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    pricePerNight: { amount: 100, currency: "USD" },
    minNights: 1,
    maxNights: 30,
    roomLocation: {
      address: "",
      city: "",
      region: "",
      country: "",
      coordinates: [],
    },
    rules: [],
    instantBook: false,
  });

  const [amenityInput, setAmenityInput] = useState("");
  const [ruleInput, setRuleInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      setError("You must be an admin to create rooms.");
    } else {
      setError("");
    }
  }, [isAdmin]);

  function updateField(path, value) {
    setForm((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let obj = updated;
      while (keys.length > 1) {
        const key = keys.shift();
        obj[key] = obj[key] || {};
        obj = obj[key];
      }
      obj[keys[0]] = value;
      return updated;
    });
  }

  function addAmenity() {
    if (!amenityInput?.trim()) return;
    updateField("amenities", [...form.amenities, amenityInput.trim()]);
    setAmenityInput("");
  }

  function removeAmenity(idx) {
    updateField(
      "amenities",
      form.amenities.filter((_, i) => i !== idx)
    );
  }

  function addRule() {
    if (!ruleInput?.trim()) return;
    updateField("rules", [...form.rules, ruleInput.trim()]);
    setRuleInput("");
  }

  function removeRule(idx) {
    updateField(
      "rules",
      form.rules.filter((_, i) => i !== idx)
    );
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    const newFiles = [...selectedFiles, ...files].slice(0, 12);
    setSelectedFiles(newFiles);

    // generate previews
    const readers = newFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) =>
            resolve({ name: file.name, src: ev.target.result });
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then(setPreviews);
    e.target.value = null;
  }

  function removeFile(index) {
    const next = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(next);
    const nextPreviews = previews.filter((_, i) => i !== index);
    setPreviews(nextPreviews);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isAdmin) {
      setError("You must be an admin to create a room.");
      return;
    }

    if (!form.roomTitle || !form.pricePerNight?.amount) {
      setError("Please provide at least a title and price.");
      return;
    }

    if (!token) {
      setError("You must be signed in to create a room.");
      return;
    }

    setSaving(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("roomTitle", form.roomTitle);
      formData.append("roomDescription", form.roomDescription || "");
      formData.append(
        "roomCapacity",
        JSON.stringify(Number(form.roomCapacity))
      );
      formData.append("bedrooms", JSON.stringify(Number(form.bedrooms)));
      formData.append("bathrooms", JSON.stringify(Number(form.bathrooms)));
      formData.append("minNights", JSON.stringify(Number(form.minNights)));
      formData.append("maxNights", JSON.stringify(Number(form.maxNights)));
      formData.append("instantBook", JSON.stringify(Boolean(form.instantBook)));

      // Nested objects
      formData.append(
        "pricePerNight",
        JSON.stringify({
          amount: Number(form.pricePerNight.amount),
          currency: form.pricePerNight.currency || "USD",
        })
      );

      formData.append(
        "roomLocation",
        JSON.stringify({
          address: form.roomLocation.address || "",
          city: form.roomLocation.city || "",
          region: form.roomLocation.region || "",
          country: form.roomLocation.country || "",
          coordinates: Array.isArray(form.roomLocation.coordinates)
            ? form.roomLocation.coordinates.map(Number).filter((n) => !isNaN(n))
            : [],
        })
      );

      formData.append("amenities", JSON.stringify(form.amenities || []));
      formData.append("rules", JSON.stringify(form.rules || []));

      selectedFiles.forEach((file) => {
        formData.append("images", file, file.name);
      });

      // createRoom from src/api/roomsApi.js supports FormData + onProgress
      const created = await createRoom(formData, token, true, {
        useCredentials: false,
        onProgress: (pct) => setProgress(pct),
      });

      setSuccess("Room created successfully.");
      setSelectedFiles([]);
      setPreviews([]);
      setForm({
        roomTitle: "",
        roomDescription: "",
        roomCapacity: 1,
        bedrooms: 1,
        bathrooms: 1,
        amenities: [],
        pricePerNight: { amount: 100, currency: "USD" },
        minNights: 1,
        maxNights: 30,
        roomLocation: {
          address: "",
          city: "",
          region: "",
          country: "",
          coordinates: [],
        },
        rules: [],
        instantBook: false,
      });
      setProgress(0);
      onCreated?.(created);
    } catch (err) {
      console.error(err);
      if (err?.status === 401 || err?.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 600);
      } else {
        setError(
          err?.message ||
            err?.response?.data?.message ||
            "Failed to create room"
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              required
              name="roomTitle"
              value={form.roomTitle}
              onChange={(e) => updateField("roomTitle", e.target.value)}
              placeholder="Room title"
              disabled={!isAdmin || saving}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="roomDescription"
              value={form.roomDescription}
              onChange={(e) => updateField("roomDescription", e.target.value)}
              placeholder="Short description"
              disabled={!isAdmin || saving}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-3">
          <Form.Group>
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={form.roomCapacity}
              onChange={(e) =>
                updateField("roomCapacity", Number(e.target.value))
              }
              disabled={!isAdmin || saving}
            />
          </Form.Group>
        </Col>

        <Col md={4} className="mb-3">
          <Form.Group>
            <Form.Label>Bedrooms</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={form.bedrooms}
              onChange={(e) => updateField("bedrooms", Number(e.target.value))}
              disabled={!isAdmin || saving}
            />
          </Form.Group>
        </Col>

        <Col md={4} className="mb-3">
          <Form.Group>
            <Form.Label>Bathrooms</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={form.bathrooms}
              onChange={(e) => updateField("bathrooms", Number(e.target.value))}
              disabled={!isAdmin || saving}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-2">
        <Form.Label>Address</Form.Label>
        <Form.Control
          value={form.roomLocation.address}
          onChange={(e) => updateField("roomLocation.address", e.target.value)}
          placeholder="Street address"
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={form.roomLocation.city}
              onChange={(e) => updateField("roomLocation.city", e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={form.roomLocation.country}
              onChange={(e) =>
                updateField("roomLocation.country", e.target.value)
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Price per night</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                min={0}
                value={form.pricePerNight.amount}
                onChange={(e) =>
                  updateField("pricePerNight.amount", Number(e.target.value))
                }
                disabled={!isAdmin || saving}
              />
              <Form.Select
                value={form.pricePerNight.currency}
                onChange={(e) =>
                  updateField("pricePerNight.currency", e.target.value)
                }
                style={{ maxWidth: 120 }}
                disabled={!isAdmin || saving}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="BRL">AOA</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Min nights</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={form.minNights}
              onChange={(e) => updateField("minNights", Number(e.target.value))}
              disabled={!isAdmin || saving}
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Max nights</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={form.maxNights}
              onChange={(e) => updateField("maxNights", Number(e.target.value))}
              disabled={!isAdmin || saving}
            />
          </Form.Group>
        </Col>
      </Row>

      <fieldset className="mb-3">
        <legend>Amenities</legend>
        <div className="mb-2">
          {form.amenities.map((a, i) => (
            <Badge bg="secondary" pill key={i} className="me-1">
              {a}{" "}
              <Button
                variant="link"
                size="sm"
                onClick={() => removeAmenity(i)}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  padding: 0,
                  marginLeft: 6,
                }}
                disabled={!isAdmin || saving}
              >
                ×
              </Button>
            </Badge>
          ))}
        </div>
        <InputGroup className="mb-2">
          <Form.Control
            placeholder="Add amenity (e.g. Wifi)"
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAmenity();
              }
            }}
            disabled={!isAdmin || saving}
          />
          <Button
            variant="outline-secondary"
            onClick={addAmenity}
            disabled={!isAdmin || saving}
          >
            Add
          </Button>
        </InputGroup>
      </fieldset>

      <fieldset className="mb-3">
        <legend>Rules</legend>
        <div className="mb-2">
          {form.rules.map((r, i) => (
            <Badge bg="info" text="dark" key={i} className="me-1">
              {r}{" "}
              <Button
                variant="link"
                size="sm"
                onClick={() => removeRule(i)}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  padding: 0,
                  marginLeft: 6,
                }}
                disabled={!isAdmin || saving}
              >
                ×
              </Button>
            </Badge>
          ))}
        </div>
        <InputGroup className="mb-2">
          <Form.Control
            placeholder="Add rule (e.g. No smoking)"
            value={ruleInput}
            onChange={(e) => setRuleInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addRule();
              }
            }}
            disabled={!isAdmin || saving}
          />
          <Button
            variant="outline-secondary"
            onClick={addRule}
            disabled={!isAdmin || saving}
          >
            Add
          </Button>
        </InputGroup>
      </fieldset>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Images</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={!isAdmin || saving}
            />
            <Form.Text className="text-muted">
              It's possible to select up to 12 images, 5MB each.
            </Form.Text>
            <div className="mt-2 d-flex flex-wrap">
              {previews.map((p, i) => (
                <div
                  key={i}
                  style={{
                    width: 100,
                    marginRight: 8,
                    marginBottom: 8,
                    position: "relative",
                  }}
                >
                  <img
                    src={p.src}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => removeFile(i)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "white",
                      textDecoration: "none",
                      padding: 4,
                    }}
                    disabled={!isAdmin || saving}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </Form.Group>
        </Col>
      </Row>

      {progress > 0 && progress < 100 && (
        <Row className="mb-3">
          <Col>
            <ProgressBar now={progress} label={`${progress}%`} />
          </Col>
        </Row>
      )}

      <Row className="mt-3">
        <Col className="d-flex justify-content-end">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={saving}
            className="me-2"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving || !isAdmin}>
            {saving ? "Saving..." : "Create Room"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default RoomForm;