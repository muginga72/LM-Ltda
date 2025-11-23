import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Spinner({ size = 48 }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        style={{ display: "block" }}
        aria-hidden="true"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="6"
        />
        <path
          d="M45 25A20 20 0 1 1 25 5"
          fill="none"
          stroke="#007bff"
          strokeWidth="6"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        Loading Room...
      </span>
    </div>
  );
}

export default function Room() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get(`/api/rooms/${id}`)
      .then((res) => {
        if (!mounted) return;
        setRoom(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <Spinner />;

  if (!room) return <p style={{ padding: 24 }}>Room not found.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>{room.roomTitle}</h2>
      <p>{room.roomDescription}</p>

      <div>
        <strong>Price:</strong> {room.pricePerNight?.amount}{" "}
        {room.pricePerNight?.currency}
      </div>

      <div>
        <strong>Capacity:</strong> {room.roomCapacity} guests, {room.bedrooms}{" "}
        bedrooms, {room.bathrooms} bathrooms
      </div>

      <div>
        <strong>Location:</strong> {room.roomLocation?.address},{" "}
        {room.roomLocation?.city}, {room.roomLocation?.country}
      </div>

      <div>
        <strong>Amenities:</strong> {room.amenities?.join(", ") || "None"}
      </div>

      <div>
        <strong>Rules:</strong> {room.rules?.join(", ") || "None"}
      </div>

      <div>
        <strong>Instant Book:</strong> {room.instantBook ? "Yes" : "No"}
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 10
        }}
      >
        {room.roomImages?.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`Room ${i}`}
            style={{ width: 200, borderRadius: 8 }}
          />
        ))}
      </div>
    </div>
  );
}