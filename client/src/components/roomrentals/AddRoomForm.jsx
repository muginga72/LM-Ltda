import React, { useState, useContext } from "react";
import { Form, Row, Col, Button, InputGroup, Badge, ProgressBar, Alert } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

function AddRoomForm({ onCreated, onCancel }) {
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
    roomLocation: { address: "", city: "", region: "", country: "", coordinates: [] },
    rules: [],
    instantBook: false
  });

  const [amenityInput, setAmenityInput] = useState("");
  const [ruleInput, setRuleInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    const newFiles = [...selectedFiles, ...files].slice(0, 12);
    setSelectedFiles(newFiles);

    // generate previews
    const readers = newFiles.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve({ name: file.name, src: ev.target.result });
      reader.readAsDataURL(file);
    }));
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
      formData.append("roomCapacity", String(form.roomCapacity));
      formData.append("bedrooms", String(form.bedrooms));
      formData.append("bathrooms", String(form.bathrooms));
      formData.append("minNights", String(form.minNights));
      formData.append("maxNights", String(form.maxNights));
      formData.append("instantBook", form.instantBook ? "true" : "false");
      formData.append("pricePerNight", JSON.stringify(form.pricePerNight));
      formData.append("roomLocation", JSON.stringify(form.roomLocation));
      formData.append("amenities", JSON.stringify(form.amenities || []));
      formData.append("rules", JSON.stringify(form.rules || []));

      selectedFiles.forEach(file => {
        formData.append("images", file, file.name);
      });

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const res = await axios.post("/api/rooms", formData, {
        headers,
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        }
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
        roomLocation: { address: "", city: "", region: "", country: "", coordinates: [] },
        rules: [],
        instantBook: false
      });
      setProgress(0);
      onCreated?.(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Failed to create room");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form.Group className="mb-3">
        <Form.Control placeholder="e.g. Cozy studio near downtown"
          value={form.roomTitle} onChange={e => updateField("roomTitle", e.target.value)} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control as="textarea" rows={3} 
        placeholder="Describe the space, and anything guests should know"
        value={form.roomDescription} onChange={e => updateField("roomDescription", e.target.value)} />
      </Form.Group>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Full address"
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
              placeholder="Enter the city"
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
              placeholder="Enter the country"
              value={form.roomLocation.country}
              onChange={e => updateField("roomLocation.country", e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-3">
          <Form.Group>
            <Form.Label>Capacity</Form.Label>
            <Form.Control type="number" min={1} value={form.roomCapacity} onChange={e => updateField("roomCapacity", Number(e.target.value))} />
          </Form.Group>
        </Col>
        <Col md={4} className="mb-3">
          <Form.Group>
            <Form.Label>Bedrooms</Form.Label>
            <Form.Control type="number" min={0} value={form.bedrooms} onChange={e => updateField("bedrooms", Number(e.target.value))} />
          </Form.Group>
        </Col>
        <Col md={4} className="mb-3">
          <Form.Group>
            <Form.Label>Bathrooms</Form.Label>
            <Form.Control type="number" min={0} value={form.bathrooms} onChange={e => updateField("bathrooms", Number(e.target.value))} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Price per night</Form.Label>
            <InputGroup>
              <Form.Control type="number" min={0} value={form.pricePerNight.amount} onChange={e => updateField("pricePerNight.amount", Number(e.target.value))} />
              <Form.Select value={form.pricePerNight.currency} onChange={e => updateField("pricePerNight.currency", e.target.value)} style={{ maxWidth: 120 }}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="BRL">BRL</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Min nights</Form.Label>
            <Form.Control type="number" min={1} value={form.minNights} onChange={e => updateField("minNights", Number(e.target.value))} />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Max nights</Form.Label>
            <Form.Control type="number" min={1} value={form.maxNights} onChange={e => updateField("maxNights", Number(e.target.value))} />
          </Form.Group>
        </Col>
      </Row>

      <fieldset className="mb-3">
        <legend>Amenities</legend>
        <div className="mb-2">
          {form.amenities.map((a, i) => (
            <Badge bg="secondary" pill key={i} className="me-1">
              {a} <Button variant="link" size="sm" onClick={() => removeAmenity(i)} style={{ color: "inherit", textDecoration: "none", padding: 0, marginLeft: 6 }}>×</Button>
            </Badge>
          ))}
        </div>
        <InputGroup className="mb-2">
          <Form.Control placeholder="Add amenity (e.g. Wifi)" value={amenityInput} onChange={e => setAmenityInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(); } }} />
          <Button variant="outline-secondary" onClick={addAmenity}>Add</Button>
        </InputGroup>
      </fieldset>

      <fieldset className="mb-3">
        <legend>Rules</legend>
        <div className="mb-2">
          {form.rules.map((r, i) => (
            <Badge bg="info" text="dark" key={i} className="me-1">
              {r} <Button variant="link" size="sm" onClick={() => removeRule(i)} style={{ color: "inherit", textDecoration: "none", padding: 0, marginLeft: 6 }}>×</Button>
            </Badge>
          ))}
        </div>
        <InputGroup className="mb-2">
          <Form.Control placeholder="Add rule (e.g. No smoking)" value={ruleInput} onChange={e => setRuleInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRule(); } }} />
          <Button variant="outline-secondary" onClick={addRule}>Add</Button>
        </InputGroup>
      </fieldset>

      <fieldset className="mb-3">
        <legend>Images</legend>
        <Form.Group className="mb-2">
          <Form.Control type="file" multiple accept="image/*" onChange={handleFileChange} />
          <Form.Text className="text-muted">It's possible to select up to 12 images, 5MB each.</Form.Text>
        </Form.Group>

        <div className="mb-2" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {previews.map((p, i) => (
            <div key={i} style={{ position: "relative", width: 96, height: 72, borderRadius: 6, overflow: "hidden", border: "1px solid #eee" }}>
              <img src={p.src} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button type="button" onClick={() => removeFile(i)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 12, width: 22, height: 22, cursor: "pointer" }} aria-label={`Remove ${p.name}`}>×</button>
            </div>
          ))}
        </div>

        {saving && <ProgressBar now={progress} label={`${progress}%`} className="mb-2" />}
      </fieldset>

      <Form.Group className="mb-3">
        <Form.Check type="checkbox" label="Instant Book" checked={form.instantBook} onChange={e => updateField("instantBook", e.target.checked)} />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button type="submit" disabled={saving} variant="primary">{saving ? "Creating…" : "Create Room"}</Button>
        <Button variant="outline-secondary" onClick={() => onCancel?.()} disabled={saving}>Cancel</Button>
      </div>
    </Form>
  );
}

export default AddRoomForm;