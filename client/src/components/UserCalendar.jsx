import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function UserCalendar({ apiBaseUrl = "", headers = {}, user }) {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const headersRef = useRef(headers);
  useEffect(() => {
    headersRef.current = headers;
  }, [headers]);

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

  const eventId = (ev) => {
    if (!ev) return "";
    if (typeof ev._id === "string") return ev._id;
    if (typeof ev._id === "object" && ev._id.$oid) return ev._id.$oid;
    return ev.id || ev._id || "";
  };

  const parseDateFromField = (val) => {
    if (!val) return null;
    if (typeof val === "object") {
      if (val.$date) {
        if (typeof val.$date === "object" && val.$date.$numberLong)
          return new Date(Number(val.$date.$numberLong));
        if (typeof val.$date === "string") return new Date(val.$date);
      }
      if (val.$numberLong) return new Date(Number(val.$numberLong));
    }
    if (typeof val === "string" || typeof val === "number")
      return new Date(val);
    return null;
  };

  const currentUserId = extractId(user);

  useEffect(() => {
    if (!currentUserId) {
      setEvents([]);
      setError(t("calendar.error"));
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

        const filtered = all.filter((item) => {
          if (!item) return false;
          const candidate =
            item.userId ?? (item.user && (item.user.id || item.user._id)) ?? "";
          let eventUserId = "";
          if (candidate === null || candidate === undefined) eventUserId = "";
          else if (
            typeof candidate === "string" ||
            typeof candidate === "number"
          )
            eventUserId = String(candidate);
          else if (typeof candidate === "object") {
            if (candidate.$oid) eventUserId = String(candidate.$oid);
            else if (candidate.id) eventUserId = String(candidate.id);
            else if (candidate._id) eventUserId = String(candidate._id);
            else eventUserId = "";
          }
          return eventUserId === currentUserId;
        });

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
        if (!didCancel) setError(t("calendar.error"));
      } finally {
        if (!didCancel) setLoading(false);
      }
    };

    fetchCalendar();

    return () => {
      didCancel = true;
      abortController.abort();
    };
  }, [apiBaseUrl, currentUserId, t]);

  // Single correct formatter for European date/time
  const formatDateTime = (dateStr, timeStr, fallbackCreatedAt) => {
    const locale =
      i18n.language === "pt"
        ? "pt-PT"
        : i18n.language === "fr"
        ? "fr-FR"
        : "en-GB"; // default to UK English for European format

    if (dateStr) {
      const dt = new Date(`${dateStr}T${timeStr || "00:00"}`);
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: timeStr ? "2-digit" : undefined,
        minute: timeStr ? "2-digit" : undefined,
        hour12: false,
      }).format(dt);
    }

    const parsed = fallbackCreatedAt ? new Date(fallbackCreatedAt) : null;
    return parsed
      ? new Intl.DateTimeFormat(locale, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(parsed)
      : "";
  };

  return (
    <section aria-label="User Events">
      <h5>{t("calendar.myEvents")}</h5>

      {loading && <p>{t("calendar.loading")}</p>}

      {error && (
        <div role="alert" style={{ color: "var(--danger, #c00)" }}>
          {error}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div role="alert" className="fade alert alert-info show">
          {t("calendar.noEvents")}
        </div>
      )}

      {!loading && events.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {events.map((ev) => {
            const id = eventId(ev) || Math.random().toString(36).slice(2, 9);
            const createdAtDate =
              parseDateFromField(ev.createdAt) || new Date();
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
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>
                    {t("calendar.title")}:{" "}
                    {t(`service.${ev.title}.title`, {
                      defaultValue: ev.title || t("calendar.untitled"),
                    })}
                  </strong>
                  <span style={{ color: "#eb1241ff", fontSize: 13 }}>
                    {t("calendar.date")}:{" "}
                    {formatDateTime(ev.date, ev.time, ev.createdAt)}
                  </span>
                </div>
                <div style={{ marginTop: 6, color: "#444", fontSize: 14 }}>
                  <span style={{ marginRight: 12 }}>
                    <strong>{t("calendar.eventId")}:</strong> {id}
                  </span>
                  <span>
                    <strong>{t("calendar.created")}:</strong>{" "}
                    {formatDateTime(null, null, createdAtDate)}
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
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      email: PropTypes.string,
    }),
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};