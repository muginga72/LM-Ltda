// AddRoomManager.jsx
import React, { useEffect, useState, useContext } from "react";
import { Form, Row, Col, Button, InputGroup, Badge, ProgressBar, Alert, Card } from "react-bootstrap";
import { fetchRooms, createRoom, updateRoom, deleteRoom } from "../../api/roomsApi";
import { AuthContext } from "../../contexts/AuthContext";

export default function AddRoomManager({ onCreated }) {
  const { user } = useContext(AuthContext);
  const token = user?.token ?? null;

  const emptyForm = {
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
    instantBook: false,
  };

  const [form, setForm] = useState(emptyForm);
  const [amenityInput, setAmenityInput] = useState("");
  const [ruleInput, setRuleInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadRooms() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }

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
    const readers = newFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve({ name: file.name, src: ev.target.result });
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

  // function startEdit(room) {
  //   const id = room.id ?? room._id ?? null;
  //   setEditingId(id);
  //   setForm({
  //     roomTitle: room.roomTitle ?? room.name ?? room.title ?? "",
  //     roomDescription: room.roomDescription ?? room.description ?? "",
  //     roomCapacity: room.roomCapacity ?? room.capacity ?? 1,
  //     bedrooms: room.bedrooms ?? 1,
  //     bathrooms: room.bathrooms ?? 1,
  //     amenities: Array.isArray(room.amenities) ? room.amenities : [],
  //     pricePerNight: room.pricePerNight ?? { amount: 100, currency: "USD" },
  //     minNights: room.minNights ?? 1,
  //     maxNights: room.maxNights ?? 30,
  //     roomLocation: room.roomLocation ?? { address: "", city: "", region: "", country: "", coordinates: [] },
  //     rules: Array.isArray(room.rules) ? room.rules : [],
  //     instantBook: !!room.instantBook,
  //   });
  //   setSelectedFiles([]);
  //   setPreviews([]);
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }

  function resetForm() {
    setForm(emptyForm);
    setAmenityInput("");
    setRuleInput("");
    setSelectedFiles([]);
    setPreviews([]);
    setEditingId(null);
    setError("");
    setSuccess("");
    setProgress(0);
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
      setError("You must be signed in to create or edit a room.");
      return;
    }

    setSaving(true);
    setProgress(0);

    try {
      const hasFiles = selectedFiles.length > 0;
      if (hasFiles) {
        const fd = new FormData();
        fd.append("roomTitle", form.roomTitle);
        fd.append("roomDescription", form.roomDescription || "");
        fd.append("roomCapacity", String(form.roomCapacity));
        fd.append("bedrooms", String(form.bedrooms));
        fd.append("bathrooms", String(form.bathrooms));
        fd.append("minNights", String(form.minNights));
        fd.append("maxNights", String(form.maxNights));
        fd.append("instantBook", form.instantBook ? "true" : "false");
        fd.append("pricePerNight", JSON.stringify(form.pricePerNight));
        fd.append("roomLocation", JSON.stringify(form.roomLocation));
        fd.append("amenities", JSON.stringify(form.amenities || []));
        fd.append("rules", JSON.stringify(form.rules || []));

        selectedFiles.forEach((file) => {
          fd.append("images", file, file.name);
        });

        // create or update with FormData
        if (editingId) {
          await updateRoom(editingId, fd, token, true);
          setSuccess("Room updated successfully.");
        } else {
          await createRoom(fd, token, true);
          setSuccess("Room created successfully.");
        }
      } else {
        // JSON payload
        const payload = {
          roomTitle: form.roomTitle,
          roomDescription: form.roomDescription,
          roomCapacity: Number(form.roomCapacity) || 1,
          bedrooms: Number(form.bedrooms) || 1,
          bathrooms: Number(form.bathrooms) || 1,
          minNights: Number(form.minNights) || 1,
          maxNights: Number(form.maxNights) || 30,
          instantBook: !!form.instantBook,
          pricePerNight: form.pricePerNight,
          roomLocation: form.roomLocation,
          amenities: form.amenities || [],
          rules: form.rules || [],
        };

        if (editingId) {
          await updateRoom(editingId, payload, token, false);
          setSuccess("Room updated successfully.");
        } else {
          await createRoom(payload, token, false);
          setSuccess("Room created successfully.");
        }
      }

      await loadRooms();
      resetForm();
      onCreated?.();
    } catch (err) {
      setError(err?.message || "Failed to save room");
    } finally {
      setSaving(false);
      setProgress(0);
    }
  }

  // async function handleDelete(room) {
  //   const id = room.id ?? room._id ?? null;
  //   if (!id) return;
  //   if (!window.confirm("Delete this room?")) return;
  //   setError("");
  //   try {
  //     await deleteRoom(id, token);
  //     setRooms((prev) => prev.filter((r) => (r.id ?? r._id) !== id));
  //     setSuccess("Room deleted.");
  //     // if we were editing this room, reset form
  //     if (editingId === id) resetForm();
  //   } catch (err) {
  //     setError(err?.message || "Failed to delete room");
  //   }
  // }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
      {/* <h3>Rooms</h3> */}

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-2">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    value={form.roomTitle}
                    onChange={(e) => updateField("roomTitle", e.target.value)}
                    required
                    placeholder="Room title"
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={form.roomDescription}
                    onChange={(e) => updateField("roomDescription", e.target.value)}
                    placeholder="Describe the space, and anything guests should know"
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-2">
                      <Form.Label>Capacity</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        value={form.roomCapacity}
                        onChange={(e) => updateField("roomCapacity", Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-2">
                      <Form.Label>Bedrooms</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        value={form.bedrooms}
                        onChange={(e) => updateField("bedrooms", Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-2">
                      <Form.Label>Bathrooms</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        value={form.bathrooms}
                        onChange={(e) => updateField("bathrooms", Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Price per night</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>{form.pricePerNight.currency}</InputGroup.Text>
                        <Form.Control
                          type="number"
                          min="0"
                          value={form.pricePerNight.amount}
                          onChange={(e) =>
                            updateField("pricePerNight", {
                              ...form.pricePerNight,
                              amount: Number(e.target.value),
                            })
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-2">
                      <Form.Label>Min nights</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        value={form.minNights}
                        onChange={(e) => updateField("minNights", Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-2">
                      <Form.Label>Max nights</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        value={form.maxNights}
                        onChange={(e) => updateField("maxNights", Number(e.target.value))}
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
                  <Col md={4}>
                    <Form.Group className="mb-2">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        value={form.roomLocation.city}
                        onChange={(e) => updateField("roomLocation.city", e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-2">
                      <Form.Label>Region</Form.Label>
                      <Form.Control
                        value={form.roomLocation.region}
                        onChange={(e) => updateField("roomLocation.region", e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-2">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        value={form.roomLocation.country}
                        onChange={(e) => updateField("roomLocation.country", e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Amenities</Form.Label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Form.Control
                      value={amenityInput}
                      onChange={(e) => setAmenityInput(e.target.value)}
                      placeholder="Add amenity  (e.g. Wifi)"
                    />
                    <Button variant="secondary" onClick={addAmenity}>
                      Add
                    </Button>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {form.amenities.map((a, i) => (
                      <Badge
                        key={i}
                        pill
                        bg="light"
                        text="dark"
                        style={{ marginRight: 6, cursor: "pointer" }}
                        onClick={() => removeAmenity(i)}
                      >
                        {a} &nbsp;✕
                      </Badge>
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Rules</Form.Label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Form.Control
                      value={ruleInput}
                      onChange={(e) => setRuleInput(e.target.value)}
                      placeholder="Add rule (e.g. No smoking)"
                    />
                    <Button variant="secondary" onClick={addRule}>
                      Add
                    </Button>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {form.rules.map((r, i) => (
                      <Badge
                        key={i}
                        pill
                        bg="light"
                        text="dark"
                        style={{ marginRight: 6, cursor: "pointer" }}
                        onClick={() => removeRule(i)}
                      >
                        {r} &nbsp;✕
                      </Badge>
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Images</Form.Label>
                  <Form.Control type="file" multiple accept="image/*" onChange={handleFileChange} />
                  <Form.Text className="text-muted">It's possible to select up to 12 images, 5MB each.</Form.Text>
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    {previews.map((p, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <img
                          src={p.src}
                          alt={p.name}
                          style={{ width: 100, height: 70, objectFit: "cover", borderRadius: 6 }}
                        />
                        <Button
                          size="sm"
                          variant="danger"
                          style={{ position: "absolute", top: -8, right: -8, borderRadius: "50%" }}
                          onClick={() => removeFile(i)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Check
                    type="checkbox"
                    label="Instant book"
                    checked={form.instantBook}
                    onChange={(e) => updateField("instantBook", e.target.checked)}
                  />
                </Form.Group>

                <div style={{ marginTop: 12 }}>
                  <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? (editingId ? "Updating..." : "Creating...") : editingId ? "Update Room" : "Create Room"}
                  </Button>{" "}
                  <Button variant="outline-secondary" onClick={resetForm} disabled={saving}>
                    Reset
                  </Button>
                </div>

                {saving && progress > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <ProgressBar now={progress} label={`${progress}%`} />
                  </div>
                )}
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* -------------------- Do Not Remove it --------------------- */}

      {/* <div>
        <h5 className="mb-3">Existing Rooms</h5>

        {loading && <div>Loading rooms…</div>}
        {!loading && rooms.length === 0 && <div>No rooms found.</div>}

        <Row xs={1} md={2} lg={3} className="g-3">
          {rooms.map((room) => {
            const id = room.id ?? room._id ?? room._id;
            return (
              <Col key={id}>
                <Card>
                  {room.images && room.images[0] ? (
                    <Card.Img variant="top" src={room.images[0].url ?? room.images[0]} style={{ height: 160, objectFit: "cover" }} />
                  ) : null}
                  <Card.Body>
                    <Card.Title style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{room.roomTitle ?? room.name ?? "Untitled"}</span>
                      <small style={{ color: "#666" }}>{room.pricePerNight?.currency ?? "USD"} {room.pricePerNight?.amount ?? "—"}</small>
                    </Card.Title>
                    <Card.Text style={{ color: "#555" }}>
                      Capacity: {room.roomCapacity ?? room.capacity ?? "—"}
                      <br />
                      {room.roomLocation?.city ? `${room.roomLocation.city}` : null}
                    </Card.Text>

                    <div style={{ display: "flex", gap: 8 }}>
                      <Button size="sm" variant="outline-primary" onClick={() => startEdit(room)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(room)}>
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div> */}
    </div>
  );
}