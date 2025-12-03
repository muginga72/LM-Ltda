// src/components/roomrentals/RoomCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { resolveRoomImage } from "../../utils/imageUtils";

/**
 * RoomCard (user-facing)
 * - Image left, content right
 * - Buttons: Book, Details, Pay (if available)
 * - Shows price, capacity (guests), bedrooms, bathrooms
 * - Displays rules as badges
 */

const PLACEHOLDER = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'>
    <rect width='100%' height='100%' fill='#f3f3f3'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-size='16'>No image</text>
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

export default function RoomCardWithPay({ room, onBook, onDetails, onPay, className }) {
  const imgUrl = firstImage(room?.images) || PLACEHOLDER;
  const title = room?.roomTitle || room?.title || "Untitled room";
  const desc = room?.roomDescription || room?.description || "";
  const price = room?.pricePerNight?.amount ?? "N/A";
  const currency = room?.pricePerNight?.currency ?? "";
  const capacity = room?.roomCapacity ?? room?.capacity ?? null;
  const bedrooms = room?.bedrooms ?? null;
  const bathrooms = room?.bathrooms ?? null;
  const rules = Array.isArray(room?.rules) ? room.rules : [];
  const available = room?.available === true; // boolean flag from API

  return (
    <div className={`card mb-3 ${className || ""}`}>
      <div className="row g-0 align-items-center">
        <div className="col-4">
          <img
            src={imgUrl}
            alt={title}
            className="img-fluid rounded-start"
            style={{ width: "100%", height: 160, objectFit: "cover" }}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
          />
        </div>

        <div className="col-8">
          <div className="card-body d-flex flex-column" style={{ minHeight: 160 }}>
            <div>
              <h5 className="card-title mb-1">{title}</h5>

              <div className="text-muted small mb-2">
                {price !== "N/A" ? `${price} ${currency} / night` : "Price: N/A"}
                {capacity !== null ? ` · ${capacity} guests` : ""}
                {bedrooms !== null ? ` · ${bedrooms} bd` : ""}
                {bathrooms !== null ? ` · ${bathrooms} ba` : ""}
              </div>

              <p className="card-text text-truncate" style={{ maxHeight: 48 }}>{desc}</p>

              {rules.length > 0 && (
                <div className="mt-2">
                  {rules.map((r, idx) => (
                    <span key={idx} className="badge bg-secondary me-1" title={r}>
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-auto d-flex gap-2">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => typeof onBook === "function" && onBook(room)}
              >
                Book
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => typeof onDetails === "function" && onDetails(room)}
              >
                Details
              </button>

              {available && (
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => typeof onPay === "function" && onPay(room)}
                >
                  Pay
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

RoomCardWithPay.propTypes = {
  room: PropTypes.object.isRequired,
  onBook: PropTypes.func,
  onDetails: PropTypes.func,
  onPay: PropTypes.func, // new
  className: PropTypes.string,
};

RoomCardWithPay.defaultProps = {
  onBook: undefined,
  onDetails: undefined,
  onPay: undefined,
  className: "",
};