// src/components/roomrentals/RoomCardWithPay.jsx
import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import RoomDetails from "./RoomDetails";
import { resolveRoomImage } from "../../utils/imageUtils";

const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'>
      <rect width='100%' height='100%' fill='#f3f3f3'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-size='20'>No image</text>
    </svg>`
  );

function safeResolve(img) {
  try {
    const url = resolveRoomImage(img);
    return url || null;
  } catch {
    return null;
  }
}

function firstImage(images) {
  if (!images) return null;
  if (Array.isArray(images)) {
    for (const img of images) {
      const u = safeResolve(img);
      if (u) return u;
    }
    return null;
  }
  return safeResolve(images);
}

/* ---------- Localization & formatting helpers (en / pt / fr) ---------- */

const conversionRates = {
  EUR: 0.8615,
  AOA: 912.085,
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
  // default target for other languages: USD (use GBP if you prefer en-GB)
  return "USD";
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

function formatCurrencyForLang(value, currency, lang) {
  const target = targetCurrencyForLang(lang);
  const intlLocale = localeForLang(lang);

  if (value == null) return "";

  const from = currency ? String(currency).toUpperCase() : null;
  const to = String(target).toUpperCase();

  if (!from) {
    try {
      return new Intl.NumberFormat(intlLocale, { maximumFractionDigits: 2 }).format(value);
    } catch {
      return String(value);
    }
  }

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

/* ---------- Component ---------- */

export default function RoomCardWithPay({
  room,
  onRequestBooking,
  onDetails,
  onPay,
  className,
  token,
  cardHeight = 250, // px
  imageHeight = 250, // px
}) {
  const { t, i18n } = useTranslation?.() ?? { t: (k) => k, i18n: { language: "en" } };
  const lang = i18n?.language ?? "en";

  const [showDetails, setShowDetails] = useState(false);

  const imgUrl = firstImage(room?.images) || PLACEHOLDER;

  // Localized title/description
  const title =
    localizedField(room, "title", lang) ??
    localizedField(room, "roomTitle", lang) ??
    room?.name ??
    t("untitledRoom", { defaultValue: "Untitled room" });

  const desc =
    localizedField(room, "description", lang) ??
    localizedField(room, "roomDescription", lang) ??
    room?.description ??
    "";

  const address =
    room?.roomLocation?.address?.address ??
    room?.roomLocation?.address ??
    room?.address ??
    "";
  const city =
    room?.roomLocation?.address?.city ??
    room?.roomLocation?.city ??
    room?.city ??
    "";
  const region =
    room?.roomLocation?.address?.region ??
    room?.roomLocation?.region ??
    room?.region ??
    "";
  const country =
    room?.roomLocation?.address?.country ??
    room?.roomLocation?.country ??
    room?.country ??
    "";
  const locParts = [address, city, region, country].filter(Boolean);
  const loc = locParts.length ? locParts.join(", ") : "";

  const price = room?.pricePerNight?.amount ?? null;
  const currency = room?.pricePerNight?.currency ?? null;
  const capacity = room?.roomCapacity ?? room?.capacity ?? null;
  const bedrooms = room?.bedrooms ?? null;
  const bathrooms = room?.bathrooms ?? null;
  const rules = Array.isArray(room?.rules) ? room.rules : [];
  const available = room?.available === true;

  // Inline styles to guarantee consistent sizing without external CSS
  const styles = {
    card: {
      height: `${cardHeight}px`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      borderRadius: 24,
      boxShadow: "0 1px 3px rgba(0,0,0,0.16)",
      background: "#fff",
    },
    row: { display: "flex", height: "100%", gap: 0 },
    imageCol: {
      flex: "0 0 40%",
      maxWidth: "40%",
      minWidth: 160,
      display: "flex",
      alignItems: "stretch",
      overflow: "hidden",
    },
    imageWrap: {
      width: "100%",
      height: `${imageHeight}px`,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f6f6f6",
    },
    img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
    contentCol: {
      flex: "1 1 60%",
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
    },
    headerRow: { marginBottom: 6 },
    metaRow: { color: "#6c757d", fontSize: 13, marginBottom: 8 },
    desc: {
      fontSize: 14,
      color: "#333",
      lineHeight: 1.3,
      marginBottom: 8,
      overflow: "auto",
      maxHeight: `${cardHeight - imageHeight - 140}px`,
      paddingRight: 6,
    },
    badges: { marginBottom: 8, display: "flex", gap: 6, flexWrap: "wrap" },
    actions: { marginTop: "auto", display: "flex", gap: 8, alignItems: "center" },
    btnPrimary: { padding: "6px 10px", fontSize: 13 },
    btnOutline: { padding: "6px 10px", fontSize: 13 },
  };

  const handleClick = () => {
    if (onRequestBooking) {
      onRequestBooking(room);
    } else {
      console.warn("onRequestBooking not provided");
    }
  };

  // Details button: always open local modal; notify parent asynchronously
  const handleDetailsClick = useCallback(() => {
    setShowDetails(true);
    if (typeof onDetails === "function") {
      setTimeout(() => {
        try {
          onDetails(room);
        } catch {
          // ignore
        }
      }, 0);
    }
  }, [onDetails, room]);

  // Price display localized and converted
  const priceDisplay =
    price != null ? formatCurrencyForLang(price, currency, lang) : t("priceNA", { defaultValue: "Price: N/A" });

  // Small helpers for labels
  const guestsLabel = t("guests", { defaultValue: "guests" });
  const bdLabel = t("bedroomsShort", { defaultValue: "bd" });
  const baLabel = t("bathroomsShort", { defaultValue: "ba" });

  return (
    <>
      <div className={className || ""} style={styles.card}>
        <div style={styles.row}>
          <div style={styles.imageCol}>
            <div style={styles.imageWrap}>
              <img
                src={imgUrl}
                alt={title}
                style={styles.img}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />
            </div>
          </div>

          <div style={styles.contentCol}>
            <div style={styles.headerRow}>
              <h5
                style={{
                  margin: 0,
                  fontSize: 16,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {title}
              </h5>
              {loc && <div style={styles.metaRow}>{loc}</div>}
            </div>

            <div style={styles.metaRow}>
              {priceDisplay}
              {capacity !== null ? ` · ${capacity} ${guestsLabel}` : ""}
              {bedrooms !== null ? ` · ${bedrooms} ${bdLabel}` : ""}
              {bathrooms !== null ? ` · ${bathrooms} ${baLabel}` : ""}
            </div>

            <div style={styles.desc} aria-label="room-description">
              {desc || <span style={{ color: "#6c757d" }}>{t("noDescription", { defaultValue: "No description provided." })}</span>}
            </div>

            {rules.length > 0 && (
              <div style={styles.badges}>
                {rules.map((r, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "#6c757d",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: 12,
                      fontSize: 12,
                      whiteSpace: "nowrap",
                    }}
                    title={r}
                  >
                    {r}
                  </span>
                ))}
              </div>
            )}

            <div style={styles.actions}>
              <button type="button" className="btn btn-outline-primary" style={styles.btnPrimary} onClick={handleClick}>
                {t("book", { defaultValue: "Book" })}
              </button>

              <button type="button" className="btn btn-outline-secondary" style={styles.btnOutline} onClick={handleDetailsClick}>
                {t("details", { defaultValue: "Details" })}
              </button>

              {available && (
                <button
                  type="button"
                  className="btn btn-success"
                  style={styles.btnPrimary}
                  onClick={() => typeof onPay === "function" && onPay(room)}
                >
                  {t("pay", { defaultValue: "Pay" })}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Always render RoomDetails modal locally */}
      <RoomDetails show={showDetails} onClose={() => setShowDetails(false)} room={room} token={token} />
    </>
  );
}

RoomCardWithPay.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string,
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onRequestBooking: PropTypes.func.isRequired,
  onDetails: PropTypes.func,
  onPay: PropTypes.func,
  className: PropTypes.string,
  token: PropTypes.string,
  cardHeight: PropTypes.number,
  imageHeight: PropTypes.number,
};

RoomCardWithPay.defaultProps = {
  onRequestBooking: () => console.warn("Booking handler not implemented"),
  onDetails: undefined,
  onPay: undefined,
  className: "",
  token: null,
  cardHeight: 250,
  imageHeight: 250,
};