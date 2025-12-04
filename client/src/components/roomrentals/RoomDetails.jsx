// src/components/roomrentals/RoomDetails.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { resolveRoomImage } from "../../utils/imageUtils";

const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'>
      <rect width='100%' height='100%' fill='#f3f3f3'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-size='16'>No image</text>
    </svg>`
  );

export default function RoomDetails({ show, onClose, room: roomProp, fetchUrl = null, token }) {
  const [room, setRoom] = useState(roomProp || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keep local room in sync when parent provides a new room prop
  useEffect(() => {
    setRoom(roomProp || null);
    setError("");
  }, [roomProp]);

  // Fetch when modal opens and we don't already have room data
  useEffect(() => {
    if (!show) return;
    if (roomProp) return;
    if (!fetchUrl) return;

    let mounted = true;
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetch(fetchUrl, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (mounted) setRoom(data);
      })
      .catch((err) => {
        if (!mounted) return;
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [show, fetchUrl, roomProp, token]);

  // Close on Escape
  useEffect(() => {
    if (!show) return;
    function onKey(e) {
      if (e.key === "Escape") {
        if (typeof onClose === "function") onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  if (!show) return null;

  if (loading) {
    return (
      <>
        <div className="modal-backdrop fade show" />
        <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Loading...</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
              </div>
              <div className="modal-body">
                <div className="text-center py-4">Loading room details…</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="modal-backdrop fade show" />
        <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Error</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
              </div>
              <div className="modal-body">
                <div className="alert alert-danger">{error}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!room) {
    return (
      <>
        <div className="modal-backdrop fade show" />
        <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">No data</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
              </div>
              <div className="modal-body">
                <div className="text-muted">No room data available.</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const images = Array.isArray(room.images)
    ? room.images.map(resolveRoomImage).filter(Boolean)
    : room.images
    ? [resolveRoomImage(room.images)]
    : [];

  const title = room.roomTitle || room.title || "Untitled room";

  // Extract location similar to RoomCardWithPay
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
  const locationString = locParts.length ? locParts.join(", ") : "";

  function backdropClick(e) {
    if (e.target.classList.contains("modal")) {
      if (typeof onClose === "function") onClose();
    }
  }

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        onMouseDown={backdropClick}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    {images.length ? (
                      <div className="mb-3">
                        {images.map((src, i) => (
                          <img
                            key={i}
                            src={src || PLACEHOLDER}
                            alt={`${title} ${i + 1}`}
                            className="img-fluid mb-2"
                            style={{ width: "100%", height: 300, objectFit: "cover", display: "block", borderRadius: "24px" }}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = PLACEHOLDER;
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-light p-5 text-center">No images</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <h6>Description</h6>
                    <p>{room.roomDescription || room.description || "No description provided."}</p>

                    {locationString && (
                      <>
                        <h6>Location</h6>
                        <div className="text-muted mb-3">{locationString}</div>
                      </>
                    )}

                    <h6>Details</h6>
                    <ul>
                      <li>
                        <strong>Price:</strong>{" "}
                        {room.pricePerNight?.amount ?? "N/A"} {room.pricePerNight?.currency ?? ""}
                      </li>
                      <li>
                        <strong>Capacity:</strong> {room.roomCapacity ?? room.capacity ?? "—"} guests
                      </li>
                      <li>
                        <strong>Bedrooms:</strong> {room.bedrooms ?? "—"}
                      </li>
                      <li>
                        <strong>Bathrooms:</strong> {room.bathrooms ?? "—"}
                      </li>
                    </ul>

                    {room.amenities && room.amenities.length > 0 && (
                      <>
                        <h6>Amenities</h6>
                        <ul>
                          {room.amenities.map((a, idx) => (
                            <li key={idx}>{a}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {room.rules && room.rules.length > 0 && (
                      <>
                        <h6>Rules</h6>
                        <ul>
                          {room.rules.map((r, idx) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

RoomDetails.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  room: PropTypes.object,
  fetchUrl: PropTypes.string,
  token: PropTypes.string,
};

RoomDetails.defaultProps = {
  room: null,
  fetchUrl: null,
  token: null,
};