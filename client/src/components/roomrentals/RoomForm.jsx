// src/components/roomrentals/RoomForm.jsx
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
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../contexts/AuthContext";
import { createRoom } from "../../api/roomsApi";

const PLACEHOLDER_TEXT =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'>
      <rect width='100%' height='100%' fill='#f3f3f3'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-size='16'>No image</text>
    </svg>`
  );

// Static conversion rates (1 USD = X)
const conversionRates = {
  EUR: 0.8615, // 1 USD = 0.8615 EUR
  AOA: 912.085, // 1 USD = 912.085 AOA
  USD: 1,
};

function localeForLang(lang) {
  if (!lang) return "en-US";
  const l = String(lang).toLowerCase();
  if (l.startsWith("fr")) return "fr-FR";
  if (l.startsWith("pt")) return "pt-PT";
  return "en-US";
}

function targetCurrencyForLang(lang) {
  const l = String(lang || "en").toLowerCase();
  if (l.startsWith("fr")) return "EUR";
  if (l.startsWith("pt")) return "AOA";
  return "USD";
}

function formatEuropeanDateTime(value, lang) {
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

function formatCurrency(value, currency, lang) {
  const target = targetCurrencyForLang(lang);
  const intlLocale = localeForLang(lang);

  if (value == null) return "";

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

  // Convert: value (from) -> USD -> to
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

function resolveInitialToken(user) {
  try {
    if (user?.token) return user.token;
    const stored = localStorage.getItem("authToken");
    return stored || null;
  } catch {
    return null;
  }
}

export default function RoomForm({ onCreated, onCancel }) {
  const { t, i18n } = useTranslation();
  const lang = i18n?.language ?? "en";

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = resolveInitialToken(user);

  // Determine role from user or token payload
  const role =
    user?.role ??
    (() => {
      if (!token) return null;
      try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = JSON.parse(
          atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        return payload.role ?? payload.roles ?? null;
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
      setError(t("mustBeAdmin"));
    } else {
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, t]);

  function updateField(path, value) {
    setForm((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (obj[key] == null || typeof obj[key] !== "object") obj[key] = {};
        obj = obj[key];
      }
      obj[keys[keys.length - 1]] = value;
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
      setError(t("mustBeAdmin"));
      return;
    }

    if (!form.roomTitle || !form.pricePerNight?.amount) {
      setError(t("provideTitleAndPrice"));
      return;
    }

    if (!token) {
      setError(t("mustBeSignedIn"));
      return;
    }

    setSaving(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("roomTitle", form.roomTitle);
      formData.append("roomDescription", form.roomDescription || "");
      formData.append("roomCapacity", JSON.stringify(Number(form.roomCapacity)));
      formData.append("bedrooms", JSON.stringify(Number(form.bedrooms)));
      formData.append("bathrooms", JSON.stringify(Number(form.bathrooms)));
      formData.append("minNights", JSON.stringify(Number(form.minNights)));
      formData.append("maxNights", JSON.stringify(Number(form.maxNights)));
      formData.append("instantBook", JSON.stringify(Boolean(form.instantBook)));

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

      // createRoom supports FormData + onProgress
      const created = await createRoom(
        formData,
        token,
        true,
        {
          useCredentials: false,
          onProgress: (pct) => setProgress(pct),
        }
      );

      setSuccess(t("roomCreated"));
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
      if (typeof onCreated === "function") onCreated(created);
    } catch (err) {
      console.error(err);
      // handle 401-like errors
      const status =
        (err && err.status) ||
        (err && err.response && err.response.status) ||
        null;
      if (status === 401) {
        setError(t("sessionExpired"));
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 600);
      } else {
        setError(
          (err && (err.message || (err.response && err.response.data && err.response.data.message))) ||
            t("failedToCreateRoom")
        );
      }
    } finally {
      setSaving(false);
    }
  }

  // Price preview formatted for current language
  const pricePreview =
    form.pricePerNight?.amount != null
      ? formatCurrency(form.pricePerNight.amount, form.pricePerNight.currency, lang)
      : t("nA");

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>{t("title")}</Form.Label>
            <Form.Control
              required
              name="roomTitle"
              value={form.roomTitle}
              onChange={(e) => updateField("roomTitle", e.target.value)}
              placeholder={t("roomTitlePlaceholder")}
              disabled={!isAdmin || saving}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>{t("description")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="roomDescription"
              value={form.roomDescription}
              onChange={(e) => updateField("roomDescription", e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              disabled={!isAdmin || saving}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-3">
          <Form.Group>
            <Form.Label>{t("capacity")}</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={form.roomCapacity}
              onChange={(e) => updateField("roomCapacity", Number(e.target.value))}
              disabled={!isAdmin || saving}
            />
          </Form.Group>
        </Col>

        <Col md={4} className="mb-3">
          <Form.Group>
            <Form.Label>{t("bedrooms")}</Form.Label>
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
            <Form.Label>{t("bathrooms")}</Form.Label>
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
        <Form.Label>{t("address")}</Form.Label>
        <Form.Control
          value={form.roomLocation.address}
          onChange={(e) => updateField("roomLocation.address", e.target.value)}
          placeholder={t("addressPlaceholder")}
          disabled={!isAdmin || saving}
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>{t("city")}</Form.Label>
            <Form.Control
              value={form.roomLocation.city}
              onChange={(e) => updateField("roomLocation.city", e.target.value)}
              disabled={!isAdmin || saving}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>{t("country")}</Form.Label>
            <Form.Control
              value={form.roomLocation.country}
              onChange={(e) => updateField("roomLocation.country", e.target.value)}
              disabled={!isAdmin || saving}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>{t("pricePerNight")}</Form.Label>
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
                <option value="AOA">AOA</option>
              </Form.Select>
            </InputGroup>
            <div className="small text-muted mt-1">
              {t("pricePreview")}: {pricePreview}
            </div>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>{t("minNights")}</Form.Label>
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
            <Form.Label>{t("maxNights")}</Form.Label>
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
        <legend>{t("amenities")}</legend>
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
            placeholder={t("addAmenityPlaceholder")}
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
            {t("add")}
          </Button>
        </InputGroup>
      </fieldset>

      <fieldset className="mb-3">
        <legend>{t("rules")}</legend>
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
            placeholder={t("addRulePlaceholder")}
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
            {t("add")}
          </Button>
        </InputGroup>
      </fieldset>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>{t("images")}</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={!isAdmin || saving}
            />
            <Form.Text className="text-muted">
              {t("imagesHelp")}
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
            {t("cancel")}
          </Button>
          <Button type="submit" variant="primary" disabled={saving || !isAdmin}>
            {saving ? `${t("saving")}...` : t("createRoom")}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}