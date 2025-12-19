// client/src/pages/roomrental/RoomListingRequest.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function RoomListingRequest() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    roomTitle: "",
    description: "",
    roomCapacity: 1,
    bedrooms: 1,
    bathrooms: 1,
    minNights: 1,
    maxNights: 30,
    instantBook: false,
    priceAmount: "",
    priceCurrency: "USD",
    roomLocation: {
      address: "",
      city: "",
      region: "",
      country: "",
      coordinates: "", // comma separated "lat,lng" optional
    },
    amenities: "", // comma separated for UI
    rules: "", // comma separated for UI
    terms: "1 month",
    acknowledge: false,
    name: "",
    email: "",
    phone: "",
  });

  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // data URLs
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("roomLocation.")) {
      const key = name.split(".")[1];
      setForm((s) => ({
        ...s,
        roomLocation: { ...s.roomLocation, [key]: value },
      }));
      return;
    }

    if (type === "checkbox") {
      setForm((s) => ({ ...s, [name]: checked }));
      return;
    }

    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleNumberChange(e) {
    const { name, value } = e.target;
    const num = value === "" ? "" : Number(value);
    setForm((s) => ({ ...s, [name]: num }));
  }

  function handleImagesChange(e) {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // generate previews
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) =>
          resolve({ name: file.name, src: ev.target.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((arr) => setImagePreviews(arr));
  }

  function resetForm() {
    setForm({
      roomTitle: "",
      description: "",
      roomCapacity: 1,
      bedrooms: 1,
      bathrooms: 1,
      minNights: 1,
      maxNights: 30,
      instantBook: false,
      priceAmount: "",
      priceCurrency: "USD",
      roomLocation: {
        address: "",
        city: "",
        region: "",
        country: "",
        coordinates: "",
      },
      amenities: "",
      rules: "",
      terms: "1 month",
      acknowledge: false,
      name: "",
      email: "",
      phone: "",
    });
    setImages([]);
    setImagePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setResult(null);
  }

  function validate() {
    if (!form.roomTitle.trim()) return "Room title is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.name.trim()) return "Your name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!form.phone.trim()) return "Phone is required.";
    if (!form.priceAmount && form.priceAmount !== 0)
      return "Price per night is required.";
    if (!form.acknowledge) return "You must acknowledge the listing terms.";
    // basic email pattern
    const emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(form.email)) return "Invalid email address.";
    // phone basic
    const phoneRe = /^[\d\s()+-]{7,20}$/;
    if (!phoneRe.test(form.phone)) return "Invalid phone number.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(null);

    const err = validate();
    if (err) {
      setResult({ ok: false, message: err });
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();

      // Basic fields
      fd.append("roomTitle", form.roomTitle);
      fd.append("description", form.description);
      fd.append("roomCapacity", String(form.roomCapacity));
      fd.append("bedrooms", String(form.bedrooms));
      fd.append("bathrooms", String(form.bathrooms));
      fd.append("minNights", String(form.minNights));
      fd.append("maxNights", String(form.maxNights));
      fd.append("instantBook", form.instantBook ? "true" : "false");

      // Price as JSON string (server safeParse will parse)
      const price = {
        amount: Number(form.priceAmount),
        currency: form.priceCurrency || "USD",
      };
      fd.append("pricePerNight", JSON.stringify(price));

      // Room location as JSON string
      const coords = form.roomLocation.coordinates
        ? form.roomLocation.coordinates
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const coordsNum = coords.length === 2 ? coords.map((c) => Number(c)) : [];
      const roomLocation = {
        address: form.roomLocation.address,
        city: form.roomLocation.city,
        region: form.roomLocation.region,
        country: form.roomLocation.country,
        coordinates: coordsNum,
      };
      fd.append("roomLocation", JSON.stringify(roomLocation));

      // Amenities & rules as JSON arrays
      const amenitiesArr = form.amenities
        ? form.amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const rulesArr = form.rules
        ? form.rules
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      fd.append("amenities", JSON.stringify(amenitiesArr));
      fd.append("rules", JSON.stringify(rulesArr));

      fd.append("terms", form.terms);
      fd.append("acknowledge", form.acknowledge ? "true" : "false");

      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);

      // Append images (field name must be "images")
      images.forEach((file) => {
        fd.append("images", file, file.name);
      });

      const resp = await fetch("/api/room-listing-request", {
        method: "POST",
        body: fd,
      });

      const json = await resp.json().catch(() => null);

      if (!resp.ok) {
        const msg = (json && json.description) || `Server error ${resp.status}`;
        setResult({ ok: false, message: msg });
      } else {
        setResult({
          ok: true,
          message: `Saved (id: ${json && json.id ? json.id : "unknown"})`,
        });
        resetForm();
      }
    } catch (err) {
      setResult({ ok: false, message: err.message || "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container my-4">
      <h3>Room Listing Request</h3>

      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="row">
          <div className="col-md-8">
            <div className="mb-3">
              <label className="form-label">Room Title</label>
              <input
                name="roomTitle"
                className="form-control"
                value={form.roomTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6 col-md-3">
                <label className="form-label">Capacity</label>
                <input
                  name="roomCapacity"
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.roomCapacity}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label">Bedrooms</label>
                <input
                  name="bedrooms"
                  type="number"
                  min="0"
                  className="form-control"
                  value={form.bedrooms}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label">Bathrooms</label>
                <input
                  name="bathrooms"
                  type="number"
                  min="0"
                  className="form-control"
                  value={form.bathrooms}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="col-6 col-md-3 d-flex align-items-end">
                <div className="form-check">
                  <input
                    id="instantBook"
                    name="instantBook"
                    type="checkbox"
                    className="form-check-input"
                    checked={form.instantBook}
                    onChange={handleChange}
                  />
                  <label htmlFor="instantBook" className="form-check-label">
                    Instant Book
                  </label>
                </div>
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <label className="form-label">Min Nights</label>
                <input
                  name="minNights"
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.minNights}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Max Nights</label>
                <input
                  name="maxNights"
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.maxNights}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Terms</label>
                <input
                  name="terms"
                  className="form-control"
                  value={form.terms}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr />

            <h5>Pricing</h5>
            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <label className="form-label">Price Amount</label>
                <input
                  name="priceAmount"
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={form.priceAmount}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Currency</label>
                <input
                  name="priceCurrency"
                  className="form-control"
                  value={form.priceCurrency}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr />

            <h5>Location</h5>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                name="roomLocation.address"
                className="form-control"
                value={form.roomLocation.address}
                onChange={handleChange}
              />
            </div>
            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <label className="form-label">City</label>
                <input
                  name="roomLocation.city"
                  className="form-control"
                  value={form.roomLocation.city}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Region</label>
                <input
                  name="roomLocation.region"
                  className="form-control"
                  value={form.roomLocation.region}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Country</label>
                <input
                  name="roomLocation.country"
                  className="form-control"
                  value={form.roomLocation.country}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Coordinates (lat,lng)</label>
              <input
                name="roomLocation.coordinates"
                className="form-control"
                placeholder="e.g. 43.6591,-70.2568"
                value={form.roomLocation.coordinates}
                onChange={handleChange}
              />
            </div>

            <hr />

            <div className="mb-3">
              <label className="form-label">Amenities (comma separated)</label>
              <input
                name="amenities"
                className="form-control"
                placeholder="WiFi,Kitchen,Heating"
                value={form.amenities}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Rules (comma separated)</label>
              <input
                name="rules"
                className="form-control"
                placeholder="No smoking,No pets"
                value={form.rules}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">You can upload up to 12 images.</label>
              <input
                ref={fileInputRef}
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="form-control"
                onChange={handleImagesChange}
              />
              <div className="mt-2 d-flex flex-wrap">
                {imagePreviews.map((p) => (
                  <div
                    key={p.name}
                    className="me-2 mb-2"
                    style={{ width: 100 }}
                  >
                    <img
                      src={p.src}
                      alt={p.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <small className="d-block text-truncate">{p.name}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Contact</h5>

                <div className="mb-3">
                  <label className="form-label">Your Name</label>
                  <input
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    name="phone"
                    className="form-control"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-check mb-2">
                  <input
                    id="acknowledge"
                    name="acknowledge"
                    type="checkbox"
                    className="form-check-input"
                    checked={form.acknowledge}
                    onChange={handleChange}
                  />
                  <label htmlFor="acknowledge" className="form-check-label">
                    I acknowledge the contract for listing and agree to the
                    terms.{" "}
                    <Link
                      to="/room-rental/contract-listing"
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      listing contract
                    </Link>
                  </label>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Listing"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                    disabled={submitting}
                  >
                    Reset
                  </button>
                </div>

                {result && (
                  <div
                    className={`mt-3 alert ${
                      result.ok ? "alert-success" : "alert-danger"
                    }`}
                    role="alert"
                  >
                    {result.message}
                  </div>
                )}

                <small className="text-muted d-block mt-2">
                  Required: room title, description, price, name, email, phone,
                  and acknowledgement.
                </small>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h6>Quick Tips</h6>
                <ul className="mb-0">
                  <li>
                    Images are uploaded as multipart/form-data under the
                    "images" field.
                  </li>
                  <li>
                    Price is sent as a JSON string in the pricePerNight field.
                  </li>
                  <li>Amenities and rules are sent as JSON arrays.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
      <footer className="text-center py-4 border-top">
        <small>
          <p>
            <strong>{t("whoWeAre.footer.phones")}:</strong> (+244) 222 022 351;
            (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046
            <br />
            {t("whoWeAre.footer.address")}
          </p>
          &copy; {new Date().getFullYear()} LM-Ltd Services.{" "}
          {t("whoWeAre.footer.copyright")}
        </small>
      </footer>
    </div>
  );
}