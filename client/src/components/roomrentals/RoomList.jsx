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

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
      {rooms.map(r => (
        <article key={r._id} style={{ border: "1px solid #eee", padding: 10, borderRadius: 6 }}>
          <Link to={`/rooms/${r._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <h4 style={{ margin: "6px 0" }}>{r.roomTitle}</h4>
          </Link>
          <div style={{ color: "#444" }}>{r.pricePerNight?.amount} {r.pricePerNight?.currency}</div>
          <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>{r.roomLocation?.city || r.roomLocation?.country || ""}</div>
        </article>
      ))}
    </div>
  );
}