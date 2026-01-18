// client/src/pages/roomrental/RoomListingRequest.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../i18n";

const conversionRates = {
  EUR: 0.8615, // 1 USD = 0.8615 EUR
  AOA: 912.085, // 1 USD = 912.085 AOA
  USD: 1,
};

function localeForLang(lang) {
  if (!lang) return "en-US";
  const l = String(lang).toLowerCase();
  if (l.startsWith("pt")) return "pt-PT";
  if (l.startsWith("fr")) return "fr-FR";
  return "en-US";
}

export function formatEuropeanDateTime(value, lang) {
  if (!value) return "";
  const locale = localeForLang(lang);
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDate(dateLike, lang) {
  if (!dateLike) return "";
  const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "";
  const intlLocale = localeForLang(lang);
  const dateFormatter = new Intl.DateTimeFormat(intlLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return dateFormatter.format(date);
}

export function formatTime(dateLike, lang) {
  if (!dateLike) return "";
  const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "";
  const intlLocale = localeForLang(lang);
  const timeFormatter = new Intl.DateTimeFormat(intlLocale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return timeFormatter.format(date);
}

function targetCurrencyForLang(lang) {
  const l = String(lang || "en").toLowerCase();
  if (l.startsWith("fr")) return "EUR";
  if (l.startsWith("pt")) return "AOA";
  // default target for other languages: USD
  return "USD";
}

export function formatCurrency(value, currency, lang) {
  const target = targetCurrencyForLang(lang);
  const intlLocale = localeForLang(lang);
  if (value == null) return "";

  // Normalize currency codes
  const from = currency ? String(currency).toUpperCase() : null;
  const to = String(target).toUpperCase();

  // If no source currency provided, just format the number
  if (!from) {
    try {
      return new Intl.NumberFormat(intlLocale, {
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return String(value);
    }
  }

  // If same currency, format directly
  if (from === to) {
    try {
      return new Intl.NumberFormat(intlLocale, {
        style: "currency",
        currency: to,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${value} ${to}`;
    }
  }

  const rateFrom = conversionRates[from];
  const rateTo = conversionRates[to];

  // If we don't have rates for either currency, fall back to formatting original value with its code
  if (typeof rateFrom !== "number" || typeof rateTo !== "number") {
    try {
      return new Intl.NumberFormat(intlLocale, {
        style: "currency",
        currency: from,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${value} ${from}`;
    }
  }

  const converted = (value / rateFrom) * rateTo;
  try {
    return new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: to,
      maximumFractionDigits: 2,
    }).format(converted);
  } catch {
    return `${converted.toFixed(2)} ${to}`;
  }
}

export default function RoomListingRequest() {
  const { t, i18n } = useTranslation();

  const lang = (i18n && i18n.language) || "en";

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

  // UI states for thank-you alert and payment modal
  const [showThankYouAlert, setShowThankYouAlert] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [lastSavedId, setLastSavedId] = useState(null);

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
    setShowThankYouAlert(false);
    setShowPaymentModal(false);
    setLastSavedId(null);
  }

  function validate() {
    if (!form.roomTitle || !form.roomTitle.trim()) return t("Room title is required.");
    if (!form.description || !form.description.trim()) return t("Description is required.");
    if (!form.name || !form.name.trim()) return t("Your name is required.");
    if (!form.email || !form.email.trim()) return t("Email is required.");
    if (!form.phone || !form.phone.trim()) return t("Phone is required.");
    if ((form.priceAmount === "" || form.priceAmount == null) && form.priceAmount !== 0)
      return t("Price per night is required.");
    if (!form.acknowledge) return t("You must acknowledge the listing terms.");
    // basic email pattern
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) return t("Invalid email address.");
    // phone basic: allow digits, spaces, parentheses, plus and hyphen; length 7-20
    const phoneRe = /^[\d\s()+-]{7,20}$/;
    if (!phoneRe.test(form.phone)) return t("Invalid phone number.");
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
        const msg = (json && json.description) || `${t("Saved")} ${resp.status}`;
        setResult({ ok: false, message: msg });
      } else {
        const id = json && json.id ? json.id : null;
        setLastSavedId(id);
        setResult({ ok: true, message: `${t("Saved")}${id ? ` (id: ${id})` : ""}` });
        setShowThankYouAlert(true);
      }
    } catch (err) {
      setResult({ ok: false, message: err.message || t("Network error") });
    } finally {
      setSubmitting(false);
    }
  }

  // Called when host closes the thank-you alert
  function handleCloseThankYou() {
    setShowThankYouAlert(false);
    setShowPaymentModal(true);
  }
  // Called when payment modal is closed (after reading instructions)
  function handleClosePaymentModal() {
    setShowPaymentModal(false);
    resetForm();
  }

  return (
    <div className="container my-4">
      <h3>{t("Room Listing Request")}</h3>

      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="row">
          <div className="col-md-8">
            <div className="mb-3">
              <label className="form-label">{t("Room Title")}</label>
              <input
                name="roomTitle"
                className="form-control"
                value={form.roomTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{t("Description")}</label>
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
                <label className="form-label">{t("Capacity")}</label>
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
                <label className="form-label">{t("Bedrooms")}</label>
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
                <label className="form-label">{t("Bathrooms")}</label>
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
                    {t("Instant Book")}
                  </label>
                </div>
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <label className="form-label">{t("Min Nights")}</label>
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
                <label className="form-label">{t("Max Nights")}</label>
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
                <label className="form-label" htmlFor="terms">
                  {t("Terms")}
                </label>
                <select
                  id="terms"
                  name="terms"
                  className="form-select"
                  value={form.terms}
                  onChange={handleChange}
                >
                  <option value="">{t("Select term")}</option>
                  <option value="1 month (13.5%)">1 month (13.5%)</option>
                  <option value="3 months (10.5%)">3 months (10.5%)</option>
                  <option value="6 months (8.5%)">6 months (8.5%)</option>
                </select>
                <p>
                  <strong>{t("Selected")}</strong>: {form.terms || t("Select term")}
                </p>
              </div>
            </div>

            <hr />

            <h5>{t("Pricing")}</h5>
            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <label className="form-label">{t("Price Amount")}</label>
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
                <label className="form-label" htmlFor="priceCurrency">
                  {t("Currency")}
                </label>
                <select
                  id="priceCurrency"
                  name="priceCurrency"
                  className="form-select"
                  value={form.priceCurrency}
                  onChange={handleChange}
                >
                  <option value="">{t("Select Currency")}</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="AOA">AOA</option>
                </select>
                <p>
                  <strong>{t("Selected")}</strong>: {form.priceCurrency || t("Select Currency")}
                </p>
              </div>
            </div>

            <hr />

            <h5>{t("Location")}</h5>
            <div className="mb-3">
              <label className="form-label">{t("Address")}</label>
              <input
                name="roomLocation.address"
                className="form-control"
                value={form.roomLocation.address}
                onChange={handleChange}
              />
            </div>
            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <label className="form-label">{t("City")}</label>
                <input
                  name="roomLocation.city"
                  className="form-control"
                  value={form.roomLocation.city}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">{t("Region")}</label>
                <input
                  name="roomLocation.region"
                  className="form-control"
                  value={form.roomLocation.region}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">{t("Country")}</label>
                <input
                  name="roomLocation.country"
                  className="form-control"
                  value={form.roomLocation.country}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">{t("Coordinates (lat, lng)")}</label>
              <input
                name="roomLocation.coordinates"
                className="form-control"
                placeholder={t("Coordinates (lat, lng)")}
                value={form.roomLocation.coordinates}
                onChange={handleChange}
              />
            </div>

            <hr />

            <div className="mb-3">
              <label className="form-label">{t("Amenities (comma separated)")}</label>
              <input
                name="amenities"
                className="form-control"
                placeholder="WiFi, Kitchen, Heating"
                value={form.amenities}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{t("Rules (comma separated)")}</label>
              <input
                name="rules"
                className="form-control"
                placeholder="No smoking, No pets"
                value={form.rules}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{t("You can upload up to 12 images.")}</label>
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
                  <div key={p.name} className="me-2 mb-2" style={{ width: 100 }}>
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
                <h5 className="card-title">{t("Contact")}</h5>

                <div className="mb-3">
                  <label className="form-label">{t("Your Name")}</label>
                  <input
                    name="name"
                    className="form-control"
                    value={form.name}
                    placeholder={t("Your Name")}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">{t("Email")}</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="e.g. yourEmail@sample.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">{t("Phone")}</label>
                  <input
                    name="phone"
                    className="form-control"
                    value={form.phone}
                    placeholder="e.g. +244 xxx xxx xxx"
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
                    {t("I acknowledge the contract for listing and agree to the terms.")}{" "}
                    <Link
                      to="/room-rental/contract-listing"
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      {t("listing contract")}
                    </Link>
                  </label>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? t("Submitting ...") : t("Submit Listing")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                    disabled={submitting}
                  >
                    {t("Reset")}
                  </button>
                </div>

                {result && (
                  <div
                    className={`mt-3 alert ${result.ok ? "alert-success" : "alert-danger"}`}
                    role="alert"
                  >
                    {result.message}
                  </div>
                )}

                <small className="text-muted d-block mt-2">
                  <strong>{t("Required:")}</strong> {t("Room Title")}, {t("Description")}, {t("Price Amount")}, {t("Your Name")}, {t("Email")}, {t("Phone")}, {t("I acknowledge the contract for listing and agree to the terms.")}
                </small>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Thank you alert that host must close to see payment modal */}
      {showThankYouAlert && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>{t("Thank you for booking!")}</strong> {t("Please close this message to view payment instructions.") || ""}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={handleCloseThankYou}
            style={{ marginLeft: 16 }}
          />
        </div>
      )}

      {/* Payment instructions modal (simple implementation) */}
      {showPaymentModal && (
        <div
          className="modal show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("Payment Instructions")}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleClosePaymentModal} />
              </div>
              <div className="modal-body">
                <p>
                  <strong>{t("Notice")}:</strong> {t("Please pay for the listing within 48 hours or the listing will be cancelled.") || "Please pay for the listing within 48 hours or the listing will be cancelled."}
                </p>

                <h6>{t("Bank Payment Details") || t("Bank")}</h6>
                <p className="mb-1"><strong>{t("Bank")}:</strong> BFA</p>
                <p className="mb-1"><strong>{t("Account name")}:</strong> Maria Miguel</p>
                <p className="mb-1"><strong>{t("Account number")}:</strong> 342295560 30 001</p>
                <p className="mb-1"><strong>{t("IBAN")}:</strong> AO06 0006 0000 42295560301 25</p>
                <p className="mb-1">
                  <strong>{t("Reference")}:</strong> {t("Please include your listing ID or email")}{lastSavedId ? ` (ID: ${lastSavedId})` : ""}
                </p>

                <hr />
                <p>
                  {t("After you complete the payment, please reply to the confirmation email or contact support at")}{" "}
                  <a href="mailto:lmj.muginga@gmail.com">LM-ltd Team</a> {t("with your payment receipt so we can activate your listing.") || ""}
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClosePaymentModal}>
                  {t("Close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center py-4 border-top">
        <small>
          <p>
            <strong>{t("whoWeAre.footer.phones")}:</strong> (+244) 222 022 351; (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046
            <br />
            {t("whoWeAre.footer.address")}
          </p>
          &copy; {new Date().getFullYear()} LM-Ltd Services. {t("whoWeAre.footer.copyright")}
        </small>
      </footer>
    </div>
  );
}