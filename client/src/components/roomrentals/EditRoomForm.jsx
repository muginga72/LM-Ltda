import React, { useState } from "react";
import axios from "axios";

export default function EditRoomForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState({
    roomTitle: initial.roomTitle || "",
    roomDescription: initial.roomDescription || "",
    roomCapacity: initial.roomCapacity || 1,
    bedrooms: initial.bedrooms || 1,
    bathrooms: initial.bathrooms || 1,
    amenities: initial.amenities || [],
    pricePerNight: initial.pricePerNight || { amount: 100, currency: "USD" },
    minNights: initial.minNights || 1,
    maxNights: initial.maxNights || 30,
    roomImages: initial.roomImages || [],
    roomLocation: initial.roomLocation || { address: "", city: "", region: "", country: "", coordinates: [] },
    rules: initial.rules || [],
    instantBook: !!initial.instantBook,
    archived: !!initial.archived
  });

  const [imageInput, setImageInput] = useState("");
  const [amenityInput, setAmenityInput] = useState("");
  const [ruleInput, setRuleInput] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(path, value) {
    setForm(prev => {
      const next = { ...prev };
      const parts = path.split(".");
      let obj = next;
      while (parts.length > 1) {
        const k = parts.shift();
        obj[k] = obj[k] ?? {};
        obj = obj[k];
      }
      obj[parts[0]] = value;
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      await axios.patch(`/api/rooms/${initial._id}`, payload);
      onSaved?.();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
      <label>Title<input value={form.roomTitle} onChange={e => updateField("roomTitle", e.target.value)} required /></label>
      <label>Description<textarea value={form.roomDescription} onChange={e => updateField("roomDescription", e.target.value)} /></label>

      <label>Capacity<input type="number" value={form.roomCapacity} onChange={e => updateField("roomCapacity", Number(e.target.value))} min={1} /></label>
      <label>Bedrooms<input type="number" value={form.bedrooms} onChange={e => updateField("bedrooms", Number(e.target.value))} min={0} /></label>
      <label>Bathrooms<input type="number" value={form.bathrooms} onChange={e => updateField("bathrooms", Number(e.target.value))} min={0} /></label>

      <label>Price<input type="number" value={form.pricePerNight.amount} onChange={e => updateField("pricePerNight.amount", Number(e.target.value))} min={0} required /></label>
      <label>Currency
        <select value={form.pricePerNight.currency} onChange={e => updateField("pricePerNight.currency", e.target.value)}>
          <option value="USD">USD</option><option value="EUR">EUR</option><option value="BRL">BRL</option>
        </select>
      </label>

      <label>Min Nights<input type="number" value={form.minNights} onChange={e => updateField("minNights", Number(e.target.value))} min={1} /></label>
      <label>Max Nights<input type="number" value={form.maxNights} onChange={e => updateField("maxNights", Number(e.target.value))} min={1} /></label>

      <fieldset>
        <legend>Amenities</legend>
        <div>{form.amenities.map((a, i) => (
          <span key={i} style={{ marginRight: 8 }}>
            {a} <button type="button" onClick={() => updateField("amenities", form.amenities.filter((_, idx) => idx !== i))}>x</button>
          </span>
        ))}</div>
        <input value={amenityInput} onChange={e => setAmenityInput(e.target.value)} />
        <button type="button" onClick={() => { if (!amenityInput) return; updateField("amenities", [...form.amenities, amenityInput]); setAmenityInput(""); }}>Add</button>
      </fieldset>

      <fieldset>
        <legend>Rules</legend>
        <div>{form.rules.map((r, i) => (
          <span key={i} style={{ marginRight: 8 }}>
            {r} <button type="button" onClick={() => updateField("rules", form.rules.filter((_, idx) => idx !== i))}>x</button>
          </span>
        ))}</div>
        <input value={ruleInput} onChange={e => setRuleInput(e.target.value)} />
        <button type="button" onClick={() => { if (!ruleInput) return; updateField("rules", [...form.rules, ruleInput]); setRuleInput(""); }}>Add</button>
      </fieldset>

      <fieldset>
        <legend>Images</legend>
        <div>{form.roomImages.map((img, i) => (
          <span key={i} style={{ marginRight: 8 }}>
            <a href={img} target="_blank" rel="noreferrer">img</a>
            <button type="button" onClick={() => updateField("roomImages", form.roomImages.filter((_, idx) => idx !== i))}>x</button>
          </span>
        ))}</div>
        <input placeholder="https://..." value={imageInput} onChange={e => setImageInput(e.target.value)} />
        <button type="button" onClick={() => { if (!imageInput) return; updateField("roomImages", [...form.roomImages, imageInput]); setImageInput(""); }}>Add</button>
      </fieldset>

      <label>Address<input value={form.roomLocation.address} onChange={e => updateField("roomLocation.address", e.target.value)} /></label>
      <label>City<input value={form.roomLocation.city} onChange={e => updateField("roomLocation.city", e.target.value)} /></label>
      <label>Region<input value={form.roomLocation.region} onChange={e => updateField("roomLocation.region", e.target.value)} /></label>
      <label>Country<input value={form.roomLocation.country} onChange={e => updateField("roomLocation.country", e.target.value)} /></label>
      <label>Coordinates<input placeholder="-70.25,43.65" defaultValue={(form.roomLocation.coordinates || []).join(",")} onBlur={e => {
        const coords = e.target.value.split(",").map(s => Number(s.trim())).filter(n => !Number.isNaN(n));
        updateField("roomLocation.coordinates", coords);
      }} /></label>

      <label>
        Instant Book
        <input type="checkbox" checked={form.instantBook} onChange={e => updateField("instantBook", e.target.checked)} />
      </label>

      <label>
        Archived
        <input type="checkbox" checked={form.archived} onChange={e => updateField("archived", e.target.checked)} />
      </label>

      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
      </div>
    </form>
  );
}