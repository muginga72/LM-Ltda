// src/components/roomrentals/RoomCardWithPay.jsx
import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
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
  const [showDetails, setShowDetails] = useState(false);

  const imgUrl = firstImage(room?.images) || PLACEHOLDER;
  const title = room?.roomTitle || room?.title || "Untitled room";
  const desc = room?.roomDescription || room?.description || "";

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

  const price = room?.pricePerNight?.amount ?? "N/A";
  const currency = room?.pricePerNight?.currency ?? "";
  const capacity = room?.roomCapacity ?? room?.capacity ?? null;
  const bedrooms = room?.bedrooms ?? null;
  const bathrooms = room?.bathrooms ?? null;
  const rules = Array.isArray(room?.rules) ? room.rules : [];
  const available = room?.available === true;

  // Inline styles to guarantee consistent sizing without external CSS
  const styles = {
    card: { height: `${cardHeight}px`, display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.16)", background: "#fff", },
    row: { display: "flex", height: "100%", gap: 0, },
    imageCol: { flex: "0 0 40%", maxWidth: "40%", minWidth: 160, display: "flex", alignItems: "stretch", overflow: "hidden", },
    imageWrap: { width: "100%", height: `${imageHeight}px`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f6f6", },
    img: { width: "100%", height: "100%", objectFit: "cover", display: "block", },
    contentCol: { flex: "1 1 60%", padding: "12px 14px", display: "flex", flexDirection: "column", minWidth: 0, },
    headerRow: { marginBottom: 6, },
    metaRow: { color: "#6c757d", fontSize: 13, marginBottom: 8, },
    desc: { fontSize: 14, color: "#333", lineHeight: 1.3, marginBottom: 8, overflow: "auto", maxHeight: `${cardHeight - imageHeight - 140}px`, paddingRight: 6, },
    badges: { marginBottom: 8, display: "flex", gap: 6, flexWrap: "wrap", },
    actions: { marginTop: "auto", display: "flex", gap: 8, alignItems: "center", },
    btnPrimary: { padding: "6px 10px", fontSize: 13, },
    btnOutline: { padding: "6px 10px", fontSize: 13, },
  };

  const handleBookClick = useCallback(() => {
    if (typeof onRequestBooking === "function") {
      onRequestBooking(room);
    } else {
      console.warn("❌ onRequestBooking not provided");
    }
  }, [onRequestBooking, room]);

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
              {price !== "N/A" ? `${price} ${currency} / night` : "Price: N/A"}
              {capacity !== null ? ` · ${capacity} guests` : ""}
              {bedrooms !== null ? ` · ${bedrooms} bd` : ""}
              {bathrooms !== null ? ` · ${bathrooms} ba` : ""}
            </div>

            <div style={styles.desc} aria-label="room-description">
              {desc || (
                <span style={{ color: "#6c757d" }}>
                  No description provided.
                </span>
              )}
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
              <button type="button" className="btn btn-primary" style={styles.btnPrimary} onClick={handleBookClick}>
                Book
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                style={styles.btnOutline}
                onClick={handleDetailsClick}
              >
                Details
              </button>

              {available && (
                <button
                  type="button"
                  className="btn btn-success"
                  style={styles.btnPrimary}
                  onClick={() => typeof onPay === "function" && onPay(room)}
                >
                  Pay
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Always render RoomDetails modal locally */}
      <RoomDetails
        show={showDetails}
        onClose={() => setShowDetails(false)}
        room={room}
        token={token}
      />
    </>
  );
}

RoomCardWithPay.propTypes = {
  room: PropTypes.object.isRequired,
  onRequestBooking: PropTypes.func.isRequired,
  onDetails: PropTypes.func,
  onPay: PropTypes.func,
  className: PropTypes.string,
  token: PropTypes.string,
  cardHeight: PropTypes.number,
  imageHeight: PropTypes.number,
};

RoomCardWithPay.defaultProps = {
  // onBook: undefined,
  onDetails: undefined,
  onPay: undefined,
  className: "",
  token: null,
  cardHeight: 250,
  imageHeight: 250,
};