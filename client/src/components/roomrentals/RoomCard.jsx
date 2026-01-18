// src/components/roomrentals/RoomCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { resolveRoomImage } from "../../utils/imageUtils";

const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'>
      <rect width='100%' height='100%' fill='#f3f4f6'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial, Helvetica, sans-serif' font-size='20'>No image</text>
    </svg>`
  );

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

function localizedField(obj, baseKey, lang) {
  if (!obj) return null;
  const l = (lang || "en").split("-")[0];
  const translationsMap = obj[`${baseKey}Translations`];
  if (translationsMap && typeof translationsMap === "object") {
    if (translationsMap[lang]) return translationsMap[lang];
    if (translationsMap[l]) return translationsMap[l];
  }
  if (obj[`${baseKey}_${lang}`]) return obj[`${baseKey}_${lang}`];
  if (obj[`${baseKey}_${l}`]) return obj[`${baseKey}_${l}`];
  if (obj[baseKey]) return obj[baseKey];
  return null;
}

function safeResolve(img) {
  try {
    const url = resolveRoomImage(img);
    return url || null;
  } catch {
    return null;
  }
}

function getImageUrls(images) {
  if (!images) return [];
  if (!Array.isArray(images)) {
    const single = safeResolve(images);
    return single ? [single] : [];
  }
  return images.map((img) => safeResolve(img)).filter(Boolean);
}

function formatLocation(loc) {
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    const parts = [];
    if (loc.address) parts.push(loc.address);
    if (loc.city) parts.push(loc.city);
    if (loc.region) parts.push(loc.region);
    if (loc.country) parts.push(loc.country);
    if (parts.length === 0 && loc.coordinates) {
      const c = loc.coordinates;
      if (Array.isArray(c) && c.length >= 2) return `${c[0]}, ${c[1]}`;
      if (c && c.lat != null && c.lng != null) return `${c.lat}, ${c.lng}`;
    }
    return parts.join(", ");
  }
  return String(loc);
}

function normalizeAmenities(amenities) {
  if (!amenities) return [];
  if (Array.isArray(amenities)) return amenities;
  if (typeof amenities === "string") {
    return amenities.split(",").map((a) => a.trim()).filter(Boolean);
  }
  if (typeof amenities === "object") {
    return Object.keys(amenities).filter((k) => amenities[k]);
  }
  return [];
}

function normalizeRules(rules) {
  if (!rules) return [];
  if (Array.isArray(rules)) return rules;
  if (typeof rules === "string") {
    return rules.split(",").map((r) => r.trim()).filter(Boolean);
  }
  return [];
}

/* Small presentational components for Edit/Delete so buttons are reusable */
function EditButton({ onEdit, room, ariaLabel }) {
  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-secondary me-2"
      onClick={() => onEdit(room)}
      aria-label={ariaLabel}
    >
      Edit
    </button>
  );
}
EditButton.propTypes = {
  onEdit: PropTypes.func.isRequired,
  room: PropTypes.object.isRequired,
  ariaLabel: PropTypes.string,
};

function DeleteButton({ onDelete, roomId }) {
  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-danger"
      onClick={() => onDelete(roomId)}
      aria-label="Delete room"
    >
      Delete
    </button>
  );
}
DeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
  roomId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default function RoomCard({ room, onEdit, onDelete, onView, isAdmin }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n && i18n.language) || "en";

  const images = getImageUrls(room?.images);
  const cover = images.length ? images[0] : null;
  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = PLACEHOLDER;
  };

  const carouselId = `carousel-${room?._id ?? Math.random().toString(36).slice(2, 9)}`;

  const safeOnEdit = typeof onEdit === "function" ? onEdit : () => {};
  const safeOnDelete = typeof onDelete === "function" ? onDelete : () => {};
  const safeOnView = typeof onView === "function" ? onView : () => {};

  // Localized title / description
  const altText =
    localizedField(room, "roomTitle", lang) ??
    localizedField(room, "title", lang) ??
    localizedField(room, "name", lang) ??
    t("untitledRoom");

  const description =
    localizedField(room, "roomDescription", lang) ??
    localizedField(room, "description", lang) ??
    room?.description ??
    "";

  // Capacity displayed as a number (fallback to "-")
  const capacityValue = room?.roomCapacity ?? room?.capacity ?? "-";

  // Bedrooms / bathrooms (try several common field names)
  const bedrooms =
    room?.bedrooms ?? room?.bedroomCount ?? room?.numBedrooms ?? room?.beds ?? "-";
  const bathrooms =
    room?.bathrooms ?? room?.bathroomCount ?? room?.numBathrooms ?? room?.baths ?? "-";

  // Rules and amenities normalized
  const rules = normalizeRules(room?.rules);
  const amenities = normalizeAmenities(room?.amenities);

  // Location formatting (handles object)
  const locationText = formatLocation(
    room?.roomLocation ?? room?.location ?? room?.address
  );

  // Price: tolerate different shapes and typos
  const priceObj = room?.pricePerNight ?? room?.price ?? null;
  const priceAmount =
    priceObj && (priceObj.amount ?? priceObj.amout ?? priceObj.price ?? null);
  const priceCurrency = priceObj && (priceObj.currency ?? priceObj.curr ?? "USD");

  // Localized price display (converts and formats based on language)
  const priceDisplay =
    priceAmount != null ? formatCurrency(priceAmount, priceCurrency, lang) : t("priceNA");

  return (
    <div className="card mb-3" style={{ borderRadius: "24px", overflow: "hidden" }}>
      <div className="row g-0 align-items-stretch">
        {/* Left: image / carousel */}
        <div className="col-md-4">
          {images.length > 1 ? (
            <div
              id={carouselId}
              className="carousel slide h-100"
              data-bs-ride="carousel"
              aria-label={`${altText} images`}
              style={{ borderTopLeftRadius: "24px", borderTopRightRadius: "24px", overflow: "hidden" }}
            >
              <div className="carousel-inner h-100">
                {images.map((src, i) => (
                  <div
                    key={`${room?._id ?? "r"}-${i}`}
                    className={`carousel-item ${i === 0 ? "active" : ""} h-100`}
                  >
                    <img
                      src={src}
                      className="d-block w-100 h-100"
                      alt={altText}
                      style={{
                        objectFit: "cover",
                        borderTopLeftRadius: "24px",
                        borderTopRightRadius: "24px",
                      }}
                      onError={handleImgError}
                    />
                  </div>
                ))}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">
                  {t("previous", { defaultValue: "Previous" })}
                </span>
              </button>

              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">
                  {t("next", { defaultValue: "Next" })}
                </span>
              </button>
            </div>
          ) : cover ? (
            <img
              src={cover}
              className="img-fluid h-100 w-100"
              alt={altText}
              style={{
                objectFit: "cover",
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
              }}
              onError={handleImgError}
            />
          ) : (
            <div className="bg-light d-flex align-items-center justify-content-center h-100">
              <img
                src={PLACEHOLDER}
                alt={altText}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  borderTopLeftRadius: "24px",
                  borderTopRightRadius: "24px",
                }}
              />
            </div>
          )}
        </div>

        {/* Right: content */}
        <div className="col-md-8">
          <div className="card-body d-flex flex-column h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="card-title mb-1">{altText}</h5>
                {locationText ? <p className="text-muted mb-1">{locationText}</p> : null}
                <div className="mb-2">
                  <span className="me-2">
                    <strong>{capacityValue}</strong> {t("guests")}
                  </span>
                  <span className="me-2">
                    <strong>{bedrooms}</strong> {t("bedroomsShort")}
                  </span>
                  <span>
                    <strong>{bathrooms}</strong> {t("bathroomsShort")}
                  </span>
                </div>

                {rules.length > 0 && (
                  <div className="mb-2" aria-label="rules">
                    {rules.map((r, idx) => (
                      <span key={idx} className="badge bg-secondary me-1">
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                {amenities.length > 0 && (
                  <div className="mb-2" aria-label="amenities">
                    {amenities.map((a, idx) => (
                      <span key={idx} className="badge bg-light text-dark border me-1">
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-end">
                {priceAmount != null ? (
                  <div className="h5 mb-0">
                    {priceDisplay}
                    <div className="small text-muted">/ {t("night", { defaultValue: "night" })}</div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="mt-auto d-flex justify-content-between align-items-center">
              <div>
                <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => safeOnView(room)}>
                  {t("view", { defaultValue: "View" })}
                </button>
                {isAdmin && (
                  <>
                    <EditButton onEdit={safeOnEdit} room={room} ariaLabel={t("editAria", { title: altText })} />
                    <DeleteButton onDelete={safeOnDelete} roomId={room?._id} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

RoomCard.propTypes = {
  room: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  isAdmin: PropTypes.bool,
};
RoomCard.defaultProps = {
  onEdit: undefined,
  onDelete: undefined,
  onView: undefined,
  isAdmin: false,
};