// src/components/roomrental/RoomListItem.jsx
import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { resolveRoomImage } from "../../utils/imageUtils";

const PLACEHOLDER_DATA_URI =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='140' viewBox='0 0 200 140'>
      <rect width='100%' height='100%' fill='#f3f3f3'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-size='12'>No image</text>
    </svg>`
  );

function getThumb(img) {
  try {
    const url = resolveRoomImage(img);
    if (!url) return PLACEHOLDER_DATA_URI;
    return url;
  } catch {
    return PLACEHOLDER_DATA_URI;
  }
}

/* ---------- Localization / formatting helpers (same approach as RoomDetails) ---------- */

function localeForLang(lang) {
  if (!lang) return "en-US";
  const l = String(lang).toLowerCase();
  if (l.startsWith("fr")) return "fr-FR";
  if (l.startsWith("pt")) return "pt-PT";
  return "en-US";
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

const conversionRates = {
  EUR: 0.8615, // 1 USD = 0.8615 EUR
  AOA: 912.085, // 1 USD = 912.085 AOA
  USD: 1,
};

function targetCurrencyForLang(lang) {
  const l = String(lang || "en").toLowerCase();
  if (l.startsWith("fr")) return "EUR";
  if (l.startsWith("pt")) return "AOA";
  return "USD";
}

function formatCurrencyForLang(value, currency, lang) {
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

/* ---------- Component ---------- */

const RoomListItem = function RoomListItemComponent({
  room,
  onEdit,
  onDelete,
  onSelect,
  isAdmin,
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n?.language ?? "en";

  const thumb =
    (room?.images && room.images.length && getThumb(room.images[0])) ||
    PLACEHOLDER_DATA_URI;

  // Localized title and description
  const localizedTitle =
    localizedField(room, "title", lang) ??
    localizedField(room, "roomTitle", lang) ??
    room.name ??
    t("untitledRoom", { defaultValue: "Untitled room" });

  const localizedDescription =
    localizedField(room, "description", lang) ??
    localizedField(room, "roomDescription", lang) ??
    (room.roomDescription ? String(room.roomDescription) : null) ??
    t("noDescription", { defaultValue: "No description" });

  // Price display: convert & format according to language
  const priceAmount = room?.pricePerNight?.amount ?? room?.price ?? null;
  const priceCurrency = room?.pricePerNight?.currency ?? room?.currency ?? null;
  const priceDisplay =
    priceAmount != null
      ? formatCurrencyForLang(priceAmount, priceCurrency, lang)
      : t("nA", { defaultValue: "N/A" });

  const capacityDisplay = room.roomCapacity ?? room.capacity ?? "—";

  return (
    <div className="d-flex align-items-center py-2 border-bottom">
      <div style={{ width: 96, height: 72, flex: "0 0 96px", marginRight: 12 }}>
        <img
          src={thumb}
          alt={localizedTitle}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 6,
          }}
          onError={(e) => {
            // prevent infinite loop if placeholder fails
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_DATA_URI;
          }}
        />
      </div>

      <div className="flex-grow-1">
        <div className="d-flex justify-content-between">
          <div>
            <strong>{localizedTitle}</strong>
            <div className="text-muted small">
              {localizedDescription.length > 120
                ? `${localizedDescription.slice(0, 120)}…`
                : localizedDescription}
            </div>
          </div>
          <div className="text-end">
            <div className="small text-muted">{priceDisplay}</div>
            <div className="small text-muted">
              {t("capacityShort", { defaultValue: "Cap:" })} {capacityDisplay}
            </div>
          </div>
        </div>

        <div className="mt-2 d-flex gap-2">
          {typeof onSelect === "function" && (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => onSelect(room)}
            >
              {t("open", { defaultValue: "Open" })}
            </button>
          )}
          {isAdmin && (
            <>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onEdit(room)}
              >
                {t("edit", { defaultValue: "Edit" })}
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(room._id)}
              >
                {t("delete", { defaultValue: "Delete" })}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

RoomListItem.propTypes = {
  room: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onSelect: PropTypes.func,
  isAdmin: PropTypes.bool,
};

RoomListItem.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
  onSelect: undefined,
  isAdmin: false,
};

export default RoomListItem;
