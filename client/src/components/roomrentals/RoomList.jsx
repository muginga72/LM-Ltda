import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function RoomList({ refreshKey, archived = false }) {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const q = new URLSearchParams({ archived: archived ? "true" : "false", limit: "100" }).toString();
    axios.get(`/api/rooms?${q}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setRooms(data);
      })
      .catch(err => {
        console.error("Room list load error:", err);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [refreshKey, archived, token]);

  if (loading) return <div>Loading rooms…</div>;
  if (!rooms.length) return <div>No rooms found.</div>;

  // grid: each card will be at least 520px wide; this yields 1 column on small screens and 2 columns on large screens
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))",
    gap: 12
  };

  return (
    <div style={gridStyle}>
      {rooms.map(r => {
        const img = r.roomImages && r.roomImages.length ? r.roomImages[0] : null;
        return (
          <article
            key={r._id}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 12,
              border: "1px solid #eee",
              padding: 12,
              borderRadius: 8,
              alignItems: "stretch",
              background: "#fff",
              minHeight: 140
            }}
          >
            {/* Image column */}
            <div
              style={{
                flex: "0 0 180px",
                width: 180,
                height: "100%",
                borderRadius: 6,
                overflow: "hidden",
                background: "#f6f6f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {img ? (
                <img
                  src={img}
                  alt={r.roomTitle || "room image"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={{ color: "#999", fontSize: 13, padding: 8, textAlign: "center" }}>No image</div>
              )}
            </div>

            {/* Content column */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <Link to={`/rooms/${r._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3 style={{ margin: "0 0 6px 0", fontSize: 18 }}>{r.roomTitle}</h3>
                  </Link>
                  <p style={{ margin: 0, color: "#555", fontSize: 14, lineHeight: "1.3" }}>
                    {r.roomDescription ? (r.roomDescription.length > 220 ? `${r.roomDescription.slice(0, 220)}…` : r.roomDescription) : 'No description'}
                  </p>
                </div>

                <div style={{ marginLeft: 8, alignSelf: "flex-start" }}>
                  <Link to={`/rooms/${r._id}`} className="btn btn-sm btn-outline-secondary" style={{ textDecoration: "none" }}>
                    Details
                  </Link>
                </div>
              </div>

              <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ color: "#333", fontWeight: 600 }}>
                  {r.pricePerNight?.amount ?? '-'} <span style={{ fontWeight: 400 }}>{r.pricePerNight?.currency ?? ''}</span>
                </div>

                <div style={{ color: "#666", fontSize: 13 }}>
                  {r.roomCapacity} guest{r.roomCapacity > 1 ? 's' : ''} • {r.bedrooms ?? 0} bd • {r.bathrooms ?? 0} ba
                </div>

                <div style={{ marginLeft: "auto" }}>
                  <button className="btn btn-primary btn-sm" onClick={() => window.location.href = `/rooms/${r._id}#book`}>
                    Book
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}