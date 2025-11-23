import React, { useState, useContext } from "react";
import { Form, Row, Col, Button, InputGroup, Badge } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

export default function AddRoomForm({ onCreated, onCancel }) {
  const { user } = useContext(AuthContext);
  const token = user?.token;

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
    roomImages: [],
    roomLocation: {
      address: "",
      city: "",
      region: "",
      country: "",
      coordinates: []
    },
    rules: [],
    instantBook: false
  });

  const [imageInput, setImageInput] = useState("");
  const [amenityInput, setAmenityInput] = useState("");
  const [ruleInput, setRuleInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [validated, setValidated] = useState(false);

  function updateField(path, value) {
    setForm(prev => {
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
    updateField("amenities", form.amenities.filter((_, i) => i !== idx));
  }

  function addRule() {
    if (!ruleInput?.trim()) return;
    updateField("rules", [...form.rules, ruleInput.trim()]);
    setRuleInput("");
  }

  function removeRule(idx) {
    updateField("rules", form.rules.filter((_, i) => i !== idx));
  }

  function addImage() {
    if (!imageInput?.trim()) return;
    updateField("roomImages", [...form.roomImages, imageInput.trim()]);
    setImageInput("");
  }

  function removeImage(idx) {
    updateField("roomImages", form.roomImages.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setValidated(true);
    if (formEl.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    if (!token) {
      alert("You must be signed in to create a room.");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.post("/api/rooms", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const created = res.data;
      onCreated?.(created);
    } catch (err) {
      console.error("Create room error:", err);
      alert(err?.response?.data?.message || "Failed to create room");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="roomTitle">
        {/* <Form.Label>Title</Form.Label> */}
        <Form.Control
          type="text"
          placeholder="Enter room title"
          value={form.roomTitle}
          onChange={e => updateField("roomTitle", e.target.value)}
          required
        />
        <Form.Control.Feedback type="invalid">Title is required.</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="roomDescription">
        {/* <Form.Label>Description</Form.Label> */}
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Describe the room"
          value={form.roomDescription}
          onChange={e => updateField("roomDescription", e.target.value)}
        />
      </Form.Group>

      <Row>
        <Col md={4} className="mb-3">
          <Form.Group controlId="roomCapacity">
            <Form.Label>Capacity</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={form.roomCapacity}
              onChange={e => updateField("roomCapacity", Number(e.target.value))}
              required
            />
            <Form.Control.Feedback type="invalid">Provide capacity (min 1).</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={4} className="mb-3">
          <Form.Group controlId="bedrooms">
            <Form.Label>Bedrooms</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={form.bedrooms}
              onChange={e => updateField("bedrooms", Number(e.target.value))}
            />
          </Form.Group>
        </Col>

        <Col md={4} className="mb-3">
          <Form.Group controlId="bathrooms">
            <Form.Label>Bathrooms</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={form.bathrooms}
              onChange={e => updateField("bathrooms", Number(e.target.value))}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="align-items-end">
        <Col md={6} className="mb-3">
          <Form.Group controlId="price">
            <Form.Label>Price per night</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                min={0}
                value={form.pricePerNight.amount}
                onChange={e => updateField("pricePerNight.amount", Number(e.target.value))}
                required
              />
              <Form.Select
                value={form.pricePerNight.currency}
                onChange={e => updateField("pricePerNight.currency", e.target.value)}
                style={{ maxWidth: 120 }}
                aria-label="Currency"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="BRL">BRL</option>
              </Form.Select>
            </InputGroup>
            <Form.Control.Feedback type="invalid">Enter a valid price.</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={3} className="mb-3">
          <Form.Group controlId="minNights">
            <Form.Label>Min nights</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={form.minNights}
              onChange={e => updateField("minNights", Number(e.target.value))}
            />
          </Form.Group>
        </Col>

        <Col md={3} className="mb-3">
          <Form.Group controlId="maxNights">
            <Form.Label>Max nights</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={form.maxNights}
              onChange={e => updateField("maxNights", Number(e.target.value))}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Address"
              value={form.roomLocation.address}
              onChange={e => updateField("roomLocation.address", e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="City"
              value={form.roomLocation.city}
              onChange={e => updateField("roomLocation.city", e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Country"
              value={form.roomLocation.country}
              onChange={e => updateField("roomLocation.country", e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-2" controlId="coordinates">
        <Form.Label>Coordinates (lng, lat)</Form.Label>
        <Form.Control
          type="text"
          placeholder="-70.25,43.65"
          onBlur={e => {
            const coords = e.target.value.split(",").map(s => Number(s.trim())).filter(n => !Number.isNaN(n));
            updateField("roomLocation.coordinates", coords);
          }}
        />
        <Form.Text className="text-muted">Optional — use "lng,lat" format for geolocation.</Form.Text>
      </Form.Group>

      <fieldset className="mb-2">
        <legend>Amenities</legend>
        <div className="mb-2">
          {form.amenities.map((a, i) => (
            <Badge bg="secondary" pill key={i} className="me-1">
              {a} <Button variant="link" size="sm" onClick={() => removeAmenity(i)} style={{ color: "inherit", textDecoration: "none" }}>×</Button>
            </Badge>
          ))}
        </div>

        <InputGroup className="mb-2">
          <Form.Control
            placeholder="Add amenity (e.g. Wifi)"
            value={amenityInput}
            onChange={e => setAmenityInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addAmenity(); } }}
          />
          <Button variant="outline-secondary" onClick={addAmenity}>Add</Button>
        </InputGroup>
      </fieldset>

      <fieldset className="mb-2">
        {/* <legend>Rules</legend> */}
        <div className="mb-2">
          {form.rules.map((r, i) => (
            <Badge bg="info" text="dark" key={i} className="me-1">
              {r} <Button variant="link" size="sm" onClick={() => removeRule(i)} style={{ color: "inherit", textDecoration: "none" }}>×</Button>
            </Badge>
          ))}
        </div>

        <InputGroup className="mb-2">
          <Form.Control
            placeholder="Add rule (e.g. No smoking)"
            value={ruleInput}
            onChange={e => setRuleInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addRule(); } }}
          />
          <Button variant="outline-secondary" onClick={addRule}>Add</Button>
        </InputGroup>
      </fieldset>

      <fieldset className="mb-3">
        {/* <legend>Images</legend> */}
        <div className="mb-2">
          {form.roomImages.map((img, i) => (
            <Badge bg="light" text="dark" key={i} className="me-1">
              <a href={img} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>img</a>
              <Button variant="link" size="sm" onClick={() => removeImage(i)} style={{ color: "inherit", textDecoration: "none" }}>×</Button>
            </Badge>
          ))}
        </div>

        <InputGroup className="mb-2">
          <Form.Control
            placeholder="Image URL (https://...)"
            value={imageInput}
            onChange={e => setImageInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
          />
          <Button variant="outline-secondary" onClick={addImage}>Add</Button>
        </InputGroup>
        <Form.Text className="text-muted">You can add image URLs; consider implementing file uploads on the server for production.</Form.Text>
      </fieldset>

      <Form.Group className="mb-3" controlId="instantBook">
        <Form.Check
          type="checkbox"
          label="Instant Book"
          checked={form.instantBook}
          onChange={e => updateField("instantBook", e.target.checked)}
        />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button type="submit" disabled={saving} variant="primary">
          {saving ? "Creating…" : "Create Room"}
        </Button>
        <Button variant="outline-secondary" onClick={() => onCancel?.()} disabled={saving}>
          Cancel
        </Button>
      </div>
    </Form>
  );
}