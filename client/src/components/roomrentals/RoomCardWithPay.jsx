// src/components/roomrentals/RoomCardWithPay.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { resolveRoomImage } from "../../utils/imageUtils";
import RoomDetails from "./RoomDetails";

const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
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

/**
 * RoomCardWithPay
 *
 * - Calls onDetails(room) if provided (parent-controlled modal/navigation).
 * - Otherwise opens a local RoomDetails modal.
 * - Prevents image shrinking by fixing the image container height and making the image fill it with object-fit: cover.
 */
export default function RoomCardWithPay({ room, onBook, onDetails, onPay, className, token }) {
  const [showDetails, setShowDetails] = useState(false);

  const imgUrl = firstImage(room?.images) || PLACEHOLDER;
  const title = room?.roomTitle || room?.title || "Untitled room";
  const desc = room?.roomDescription || room?.description || "";

  // Safe extraction of location fields from common room models:
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
  const locParts = [city, region, country].filter(Boolean);
  const loc = locParts.length ? locParts.join(", ") : "";

  const price = room?.pricePerNight?.amount ?? "N/A";
  const currency = room?.pricePerNight?.currency ?? "";
  const capacity = room?.roomCapacity ?? room?.capacity ?? null;
  const bedrooms = room?.bedrooms ?? null;
  const bathrooms = room?.bathrooms ?? null;
  const rules = Array.isArray(room?.rules) ? room.rules : [];
  const available = room?.available === true; // boolean flag from API

  function handleDetailsClick() {
    // If parent wants to control details (open modal or navigate), call it.
    if (typeof onDetails === "function") {
      onDetails(room);
      return;
    }
    // Otherwise open local modal
    setShowDetails(true);
  }

  return (
    <>
      <div className={`card mb-3 ${className || ""}`}>
        <div className="row g-0 align-items-center">
          <div className="col-4">
            {/* fixed-height container prevents image from shrinking */}
            <div style={{ height: 220, overflow: "hidden" }}>
              <img
                src={imgUrl}
                alt={title}
                className="img-fluid rounded-start"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />
            </div>
          </div>

          <div className="col-8">
            <div className="card-body d-flex flex-column" style={{ minHeight: 160 }}>
              <div>
                <h5 className="card-title mb-1">{title}</h5>

                {loc && <div className="text-muted small mb-2">{loc}</div>}

                <div className="text-muted small mb-2">
                  {price !== "N/A" ? `${price} ${currency} / night` : "Price: N/A"}
                  {capacity !== null ? ` · ${capacity} guests` : ""}
                  {bedrooms !== null ? ` · ${bedrooms} bd` : ""}
                  {bathrooms !== null ? ` · ${bathrooms} ba` : ""}
                </div>

                <p className="card-text text-truncate" style={{ maxHeight: 48 }}>
                  {desc}
                </p>

                {rules.length > 0 && (
                  <div className="my-2">
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
                  onClick={handleDetailsClick}
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

      {/* Local modal fallback when parent did not provide onDetails */}
      {!onDetails && (
        <RoomDetails
          show={showDetails}
          onClose={() => setShowDetails(false)}
          room={room}
          token={token}
        />
      )}
    </>
  );
}

RoomCardWithPay.propTypes = {
  room: PropTypes.object.isRequired,
  onBook: PropTypes.func,
  onDetails: PropTypes.func,
  onPay: PropTypes.func,
  className: PropTypes.string,
  token: PropTypes.string,
};

RoomCardWithPay.defaultProps = {
  onBook: undefined,
  onDetails: undefined,
  onPay: undefined,
  className: "",
  token: null,
};