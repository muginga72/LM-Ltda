// src/components/roomrental/BookingListItem.jsx
import React from "react";
import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";

const TRANSLATIONS = {
  en: {
    roomFallback: "Room",
    nights: "night",
    nightsPlural: "nights",
    total: "Total:",
    status: "Status:",
    expiresAt: "Expires at:",
    view: "View",
    cancel: "Cancel",
    statuses: {
      pending: "Pending",
      confirmed: "Confirmed",
      cancelled: "Cancelled",
      checked_in: "Checked in",
      checked_out: "Checked out",
      // add more status keys as needed
    },
  },
  pt: {
    roomFallback: "Quarto",
    nights: "noite",
    nightsPlural: "noites",
    total: "Total:",
    status: "Estado:",
    expiresAt: "Expira em:",
    view: "Ver",
    cancel: "Cancelar",
    statuses: {
      pending: "Pendente",
      confirmed: "Confirmado",
      cancelled: "Cancelado",
      checked_in: "Check-in",
      checked_out: "Check-out",
    },
  },
  fr: {
    roomFallback: "Chambre",
    nights: "nuit",
    nightsPlural: "nuits",
    total: "Total :",
    status: "Statut :",
    expiresAt: "Expire le :",
    view: "Voir",
    cancel: "Annuler",
    statuses: {
      pending: "En attente",
      confirmed: "Confirmé",
      cancelled: "Annulé",
      checked_in: "Arrivé",
      checked_out: "Parti",
    },
  },
};

function getTranslation(lang, keyPath, fallback = "") {
  const parts = keyPath.split(".");
  let cur = TRANSLATIONS[lang] || TRANSLATIONS.en;
  for (const p of parts) {
    if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
      cur = cur[p];
    } else {
      return fallback;
    }
  }
  return cur;
}

function formatDate(dateString, lang, options = {}) {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString(lang, options);
  } catch {
    return dateString;
  }
}

function formatDateTime(dateString, lang, options = {}) {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return d.toLocaleString(lang, options);
  } catch {
    return dateString;
  }
}

function formatCurrency(amount, currency, lang) {
  if (amount == null) return "";
  const cur = currency || "USD";
  try {
    return new Intl.NumberFormat(lang, {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // fallback simple formatting
    return `${amount} ${cur}`;
  }
}

export default function BookingListItem({
  booking,
  onCancel,
  onView,
  lang = "en",
}) {
  const locale = ["en", "pt", "fr"].includes(lang) ? lang : "en";

  const start = formatDate(booking.startDate, locale);
  const end = formatDate(booking.endDate, locale);
  const expires = booking.expiresAt
    ? formatDateTime(booking.expiresAt, locale)
    : null;

  const nights = Number(booking.nights) || 0;
  const nightsLabel =
    nights === 1
      ? getTranslation(locale, "nights")
      : getTranslation(locale, "nightsPlural");

  const amount =
    booking.totalPrice?.amount != null ? booking.totalPrice.amount : booking.totalAmount;
  const currency =
    booking.totalPrice?.currency || booking.currency || "USD";
  const totalFormatted = formatCurrency(amount, currency, locale);

  const roomTitle = booking.room?.roomTitle || getTranslation(locale, "roomFallback");

  const statusKey = (booking.status || "").toString().toLowerCase();
  const statusLabel =
    getTranslation(locale, `statuses.${statusKey}`) || booking.status || "";

  const showCancel =
    statusKey !== "cancelled" && statusKey !== "confirmed";

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div>
            <h5>{roomTitle}</h5>
            <div>
              {start} — {end} ({nights} {nightsLabel})
            </div>
            <div className="text-muted">
              <strong>{getTranslation(locale, "total")}</strong>{" "}
              {totalFormatted}
            </div>
            <div className="mt-1">
              <strong>{getTranslation(locale, "status")}</strong> {statusLabel}
            </div>
            {expires && statusKey === "pending" && (
              <div className="text-warning">
                {getTranslation(locale, "expiresAt")} {expires}
              </div>
            )}
          </div>

          <div className="d-flex flex-column gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onView && onView(booking)}
            >
              {getTranslation(locale, "view")}
            </Button>

            {showCancel && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onCancel && onCancel(booking)}
              >
                {getTranslation(locale, "cancel")}
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

BookingListItem.propTypes = {
  booking: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    expiresAt: PropTypes.string,
    nights: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    totalAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    totalPrice: PropTypes.shape({
      amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      currency: PropTypes.string,
    }),
    currency: PropTypes.string,
    room: PropTypes.shape({
      roomTitle: PropTypes.string,
    }),
    status: PropTypes.string,
  }).isRequired,
  onCancel: PropTypes.func,
  onView: PropTypes.func,
  lang: PropTypes.oneOf(["en", "pt", "fr"]),
};