import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export default function UserCalendar({ apiBaseUrl = "", headers = {}, user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keep a ref to the latest headers so the effect doesn't depend on the headers object identity
  const headersRef = useRef(headers);
  useEffect(() => {
    headersRef.current = headers;
  }, [headers]);

  // Helper to extract an id from various shapes: string, number, { $oid: string }
  const extractId = (u) => {
    if (!u) return "";
    if (typeof u === "string" || typeof u === "number") return String(u);
    if (u.id) return String(u.id);
    if (u._id) {
      if (typeof u._id === "string") return String(u._id);
      if (typeof u._id === "object" && u._id.$oid) return String(u._id.$oid);
    }
    return "";
  };

  // Helper to extract a stable event id for React keys and display
  const eventId = (ev) => {
    if (!ev) return "";
    if (typeof ev._id === "string") return ev._id;
    if (typeof ev._id === "object" && ev._id.$oid) return ev._id.$oid;
    return ev.id || ev._id || "";
  };

  // Helper to parse createdAt values that might be strings, numbers, or Mongo extended format
  const parseDateFromField = (val) => {
    if (!val) return null;
    // Mongo extended: { $date: { $numberLong: "1234567890123" } } or { $date: "2025-11-30T16:00:00.000Z" }
    if (typeof val === "object") {
      if (val.$date) {
        if (typeof val.$date === "object" && val.$date.$numberLong)
          return new Date(Number(val.$date.$numberLong));
        if (typeof val.$date === "string") return new Date(val.$date);
      }
      if (val.$numberLong) return new Date(Number(val.$numberLong));
    }
    if (typeof val === "string" || typeof val === "number") return new Date(val);
    return null;
  };

  const currentUserId = extractId(user);

  useEffect(() => {
    if (!currentUserId) {
      setEvents([]);
      setError("Missing user id");
      setLoading(false);
      return;
    }

    setError(null);
    const abortController = new AbortController();
    let didCancel = false;

    const fetchCalendar = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = (apiBaseUrl || "").replace(/\/+$/, "");
        const url = `${base}/api/admin/calendar`;

        const res = await axios.get(url, {
          headers: headersRef.current,
          signal: abortController.signal,
        });

        if (didCancel) return;

        const all = Array.isArray(res.data) ? res.data : [];

        // Filter events where event.userId matches the current user's id (supporting multiple id shapes)
        const filtered = all.filter((item) => {
          if (!item) return false;
          const candidate =
            item.userId ?? (item.user && (item.user.id || item.user._id)) ?? "";
          let eventUserId = "";
          if (candidate === null || candidate === undefined) eventUserId = "";
          else if (typeof candidate === "string" || typeof candidate === "number")
            eventUserId = String(candidate);
          else if (typeof candidate === "object") {
            if (candidate.$oid) eventUserId = String(candidate.$oid);
            else if (candidate.id) eventUserId = String(candidate.id);
            else if (candidate._id) eventUserId = String(candidate._id);
            else eventUserId = "";
          }
          return eventUserId === currentUserId;
        });

        // Sort by date + time ascending; tolerate missing time
        filtered.sort((a, b) => {
          const aDate = new Date(
            `${a.date || ""}T${a.time || "00:00"}`
          ).getTime();
          const bDate = new Date(
            `${b.date || ""}T${b.time || "00:00"}`
          ).getTime();
          return aDate - bDate;
        });

        setEvents(filtered);
      } catch (err) {
        if (axios.isCancel && axios.isCancel(err)) return;
        if (err?.name === "CanceledError") return;
        console.error("Calendar fetch error:", err);
        if (!didCancel) setError("Failed to load calendar events.");
      } finally {
        if (!didCancel) setLoading(false);
      }
    };

    fetchCalendar();

    return () => {
      didCancel = true;
      abortController.abort();
    };
  }, [apiBaseUrl, currentUserId]);

  const formatDateTime = (dateStr, timeStr, fallbackCreatedAt) => {
    if (dateStr) {
      try {
        const dt = new Date(`${dateStr}T${timeStr || "00:00"}`);
        return dt.toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: timeStr ? "short" : undefined,
        });
      } catch {
        return `${dateStr} ${timeStr || ""}`;
      }
    }
    const parsed = parseDateFromField(fallbackCreatedAt);
    if (parsed) return parsed.toLocaleString();
    return "";
  };

  return (
    <section aria-label="User Events">
      <h5>My Events</h5>

      {loading && <p>Loading events…</p>}

      {error && (
        <div role="alert" style={{ color: "var(--danger, #c00)" }}>
          {error}
        </div>
      )}

      {!loading && !error && events.length === 0 && <p>No events found for this user.</p>}

      {!loading && events.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {events.map((ev) => {
            const id = eventId(ev) || Math.random().toString(36).slice(2, 9);
            const createdAtDate = parseDateFromField(ev.createdAt) || new Date();
            return (
              <li
                key={id}
                style={{
                  border: "1px solid #e6e6e6",
                  padding: "12px",
                  borderRadius: 6,
                  marginBottom: 8,
                  background: ev.createdByAdmin ? "#caf0dbff" : "white",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{ev.title || "Untitled"}</strong>
                  <span style={{ color: "#eb1241ff", fontSize: 13 }}>
                    {formatDateTime(ev.date, ev.time, ev.createdAt)}
                  </span>
                </div>
                <div style={{ marginTop: 6, color: "#444", fontSize: 14 }}>
                  <span style={{ marginRight: 12 }}>
                    <strong>Event ID:</strong> {id}
                  </span>
                  <span>
                    <strong>Created:</strong> {createdAtDate.toLocaleString()}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

UserCalendar.propTypes = {
  apiBaseUrl: PropTypes.string,
  headers: PropTypes.object,
  user: PropTypes.oneOfType([
    // allow either a plain id or an object containing id/_id
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      email: PropTypes.string,
    }),
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};