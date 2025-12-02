// src/components/roomrental/ListRoomItem.jsx
import React from "react";
import PropTypes from "prop-types";
import { resolveRoomImage } from "../../utils/imageUtils";

/**
 * ListRoomItem
 * Compact list item for a room used in admin lists.
 *
 * Fixes applied:
 * - Uses an inline SVG data-URI placeholder so missing assets don't cause additional 404s.
 * - Robustly resolves image URLs via resolveRoomImage and falls back to the placeholder.
 * - Ensures onError handler sets a safe placeholder and removes itself to avoid loops.
 */

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

export default function ListRoomItem({
  room,
  onEdit,
  onDelete,
  onSelect,
  isAdmin,
}) {
  const thumb =
    (room?.images && room.images.length && getThumb(room.images[0])) ||
    PLACEHOLDER_DATA_URI;

  return (
    <div className="d-flex align-items-center py-2 border-bottom">
      <div style={{ width: 96, height: 72, flex: "0 0 96px", marginRight: 12 }}>
        <img
          src={thumb}
          alt={room.roomTitle || room.title || "room"}
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
            <strong>{room.roomTitle || room.title}</strong>
            <div className="text-muted small">
              {room.roomDescription
                ? String(room.roomDescription).slice(0, 120)
                : "No description"}
            </div>
          </div>
          <div className="text-end">
            <div className="small text-muted">
              {room.pricePerNight?.amount ?? "N/A"}{" "}
              {room.pricePerNight?.currency ?? ""}
            </div>
            <div className="small text-muted">
              Cap: {room.roomCapacity ?? room.capacity ?? "—"}
            </div>
          </div>
        </div>

        <div className="mt-2 d-flex gap-2">
          {typeof onSelect === "function" && (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => onSelect(room)}
            >
              Open
            </button>
          )}
          {isAdmin && (
            <>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onEdit(room)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(room._id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

ListRoomItem.propTypes = {
  room: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onSelect: PropTypes.func,
  isAdmin: PropTypes.bool,
};

ListRoomItem.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
  onSelect: undefined,
  isAdmin: false,
};
