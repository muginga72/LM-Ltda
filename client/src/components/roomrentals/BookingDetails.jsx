// src/components/BookingDetails.jsx
import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import { useI18n } from "../../i18n";
import { EuropeanDateRange, EuropeanDateTime } from "../common/EuropeanDate";

const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'>
      <rect width='100%' height='100%' fill='#f3f3f3'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-size='20'>No image available</text>
    </svg>`
  );

function resolveFirstImage(images) {
  if (!images) return null;
  if (Array.isArray(images)) {
    for (const img of images) {
      const url = resolveImageUrl(img);
      if (url) return url;
    }
    return null;
  }
  return resolveImageUrl(images);
}

function resolveImageUrl(img) {
  try {
    if (!img) return null;
    if (typeof img === "string") {
      return img;
    }
    if (img.url && typeof img.url === "string") return img.url;
    if (img.filename && typeof img.filename === "string")
      return `/uploads/rooms/${img.filename}`;
    return null;
  } catch {
    return null;
  }
}

export default function BookingDetails({ booking, onClose }) {
  const { t } = useI18n();

  if (!booking) return null;

  const imageUrl = resolveFirstImage(booking.room?.images) || PLACEHOLDER;
  const unknown = t("BookingDetails.unknown") || "—";

  return (
    <Modal show={!!booking} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {t("BookingDetails.title", { id: booking._id ?? booking.id ?? unknown })}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Top image to attract the user */}
        <div className="mb-3" style={{ textAlign: "center" }}>
          <img
            src={imageUrl}
            alt={booking.room?.roomTitle || t("BookingDetails.roomImageAltFallback")}
            style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 24 }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
            }}
          />
        </div>

        <p>
          <strong>{t("BookingDetails.roomLabel") || "Room"}:</strong>{" "}
          {booking.room?.roomTitle || booking.room?.title || unknown}
        </p>

        <p>
          <strong>{t("BookingDetails.datesLabel") || "Dates"}:</strong>{" "}
          <EuropeanDateRange start={booking.startDate} end={booking.endDate} /> (
          {booking.nights ?? unknown} {booking.nights ? "nights" : ""})
        </p>

        <p>
          <strong>{t("BookingDetails.guestLabel") || "Guest"}:</strong>{" "}
          {booking.guest?.name || booking.guest?._id || unknown}
        </p>

        <p>
          <strong>{t("BookingDetails.statusLabel") || "Status"}:</strong>{" "}
          {booking.status || unknown}
        </p>

        <p>
          <strong>{t("BookingDetails.totalLabel") || "Total"}:</strong>{" "}
          {booking.totalPrice?.amount ?? booking.totalAmount ?? unknown}{" "}
          {booking.totalPrice?.currency ?? booking.currency ?? ""}
        </p>

        {booking.idDocument && (
          <p>
            <strong>{t("BookingDetails.idUploadedLabel") || "ID uploaded"}:</strong>{" "}
            {booking.idDocument.originalName || booking.idDocument.filename || t("BookingDetails.unknown")}
          </p>
        )}

        {booking.expiresAt && (
          <p>
            <strong>{t("BookingDetails.expiresAtLabel") || "Expires at"}:</strong>{" "}
            <EuropeanDateTime value={booking.expiresAt} />
          </p>
        )}

        {booking.notes && (
          <p>
            <strong>{t("BookingDetails.notesLabel") || "Notes"}:</strong> {booking.notes}
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {t("BookingDetails.close") || "Close"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

BookingDetails.propTypes = {
  booking: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

BookingDetails.defaultProps = {
  booking: null,
};