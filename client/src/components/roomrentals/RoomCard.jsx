// src/components/roomrentals/RoomCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { resolveRoomImage } from "../../utils/imageUtils";

const PLACEHOLDER = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'>
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

function getImageUrls(images) {
  if (!images) return [];
  if (!Array.isArray(images)) {
    const single = safeResolve(images);
    return single ? [single] : [];
  }
  return images.map((img) => safeResolve(img)).filter(Boolean);
}

export default function RoomCard({ room, onEdit, onDelete, onView, isAdmin }) {
  const images = getImageUrls(room?.images);
  const cover = images.length ? images[0] : null;

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = PLACEHOLDER;
  };

  const carouselId = `carousel-${room?._id ?? Math.random().toString(36).slice(2, 9)}`;

  const safeOnEdit = typeof onEdit === "function" ? onEdit : () => {};
  const safeOnDelete = typeof onDelete === "function" ? onDelete : () => {};
  const safeOnView = typeof onView === "function" ? onView : null;

  // Use the room title as alt text; avoid words like "image", "photo", "picture"
  const altText = room?.roomTitle || room?.title || "Room";

  return (
    <div className="card h-100">
      {images.length > 1 ? (
        <div id={carouselId} className="carousel slide" data-bs-ride="carousel" aria-label={`${altText} images`}>
          <div className="carousel-inner">
            {images.map((src, i) => (
              <div key={`${room?._id ?? "r"}-${i}`} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                <img
                  src={src}
                  className="d-block w-100"
                  alt={altText}
                  style={{ height: 300, objectFit: "cover" }}
                  onError={handleImgError}
                />
              </div>
            ))}
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>

          <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      ) : cover ? (
        <img
          src={cover}
          className="card-img-top"
          alt={altText}
          style={{ height: 300, objectFit: "cover" }}
          onError={handleImgError}
        />
      ) : (
        <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 200 }}>
          <img src={PLACEHOLDER} alt={altText} style={{ maxWidth: "100%", maxHeight: "100%" }} />
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{room?.roomTitle || room?.title || "Untitled room"}</h5>

        <p className="card-text text-truncate" style={{ maxHeight: 72 }}>
          {room?.roomDescription || room?.description || "No description provided."}
        </p>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <strong className="me-1">{room?.pricePerNight?.amount ?? "N/A"}</strong>
              <small className="text-muted">{room?.pricePerNight?.currency ?? ""} / night</small>
            </div>
            <div>
              <small className="text-muted">Guests: {room?.roomCapacity ?? room?.capacity ?? "—"}</small>
            </div>
          </div>

          <div className="d-flex gap-2">
            {safeOnView && (
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => safeOnView(room)}>
                View
              </button>
            )}

            {isAdmin && (
              <>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => safeOnEdit(room)}>
                  Edit
                </button>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => safeOnDelete(room?._id)}>
                  Delete
                </button>
              </>
            )}
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