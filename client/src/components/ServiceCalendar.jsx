// src/components/ServiceCalendar.jsx
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Spinner, Table } from "react-bootstrap";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ENDPOINTS = [
  "/api/calendar/availability",
  "/api/admin/calendar/availability",
  "/api/admin/calendar"
];

const ServiceCalendar = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [triedEndpoint, setTriedEndpoint] = useState(null);

  const { t, i18n } = useTranslation();

  const fetchFrom = useCallback(async (url) => {
    setTriedEndpoint(url);
    try {
      const res = await axios.get(url);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data && res.data.availability
        ? res.data.availability
        : [];
      return { ok: true, data, url };
    } catch (err) {
      return {
        ok: false,
        status: err?.response?.status,
        message: err?.response?.data?.error || err.message || "Request failed",
        url
      };
    }
  }, []);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAvailability([]);
    try {
      let success = false;
      let lastError = null;
      for (let i = 0; i < ENDPOINTS.length; i++) {
        const url = ENDPOINTS[i];
        const result = await fetchFrom(url);
        if (result.ok) {
          setAvailability(result.data || []);
          success = true;
          break;
        } else {
          lastError = { url: result.url, status: result.status, message: result.message };
          // try next endpoint in all cases
        }
      }

      if (!success) {
        if (lastError) {
          if (lastError.status === 404) {
            setError({
              type: "not_found",
              message: `Availability endpoint not found. Tried: ${ENDPOINTS.join(", ")}`,
              url: lastError.url
            });
          } else {
            setError({
              type: "server",
              message: `Request to ${lastError.url} failed: ${lastError.message}`,
              url: lastError.url
            });
          }
        } else {
          setError({
            type: "unknown",
            message: "Failed to fetch availability.",
            url: null
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFrom]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleRetry = () => {
    setError(null);
    fetchAvailability();
  };

  const renderTimeCell = (slotTime) => {
    if (!slotTime) return t("calendar.table.allDay");
    const trimmed = String(slotTime).trim();
    if (trimmed.length === 0) return t("calendar.table.allDay");
    // treat common variants as all-day
    const lower = trimmed.toLowerCase();
    if (
      lower === "all day" ||
      lower === "allday" ||
      lower === "all-day" ||
      lower === "day" ||
      lower === "all_day"
    ) {
      return t("calendar.table.allDay");
    }
    return trimmed;
  };

  return (
    <div className="p-3">
      <h5>{t("calendar.heading")}</h5>

      {loading && (
        <div className="my-3">
          <Spinner animation="border" size="sm" />{" "}
          <span className="ms-2">{t("calendar.loading")}</span>
        </div>
      )}

      {!loading && error && (
        <Alert variant={error.type === "not_found" ? "warning" : "danger"}>
          <div>
            <strong>Error:</strong>{" "}
            {t(`calendar.error.${error.type}`, {
              url: error.url,
              message: error.message,
              endpoints: ENDPOINTS.join(", ")
            })}
          </div>
          <div className="mt-2">
            <small>
              {t("calendar.lastTried")}: <code>{triedEndpoint || "none"}</code>.{" "}
              {t("calendar.endpointHint", { endpoints: ENDPOINTS.join(", ") })}
            </small>
          </div>
          <div className="mt-2">
            <Button size="sm" onClick={handleRetry} variant="outline-primary">
              {t("calendar.retry")}
            </Button>{" "}
            <Button size="sm" onClick={() => window.location.reload()} variant="outline-secondary">
              {t("calendar.reload")}
            </Button>
          </div>
        </Alert>
      )}

      {!loading && !error && availability.length === 0 && (
        <Alert variant="info">{t("calendar.noAvailability")}</Alert>
      )}

      {!loading && availability.length > 0 && (
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>{t("calendar.table.date")}</th>
              <th>{t("calendar.table.time")}</th>
              <th>{t("calendar.table.available")}</th>
            </tr>
          </thead>
          <tbody>
            {availability.map((slot) => {
              const id = slot._id || slot.id || `${slot.date}-${slot.time}`;
              const dateString = (() => {
                try {
                  const d = new Date(slot.date);
                  return d.toLocaleDateString(i18n.language || "en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  });
                } catch {
                  return slot.date || "";
                }
              })();

              return (
                <tr key={id}>
                  <td>{dateString}</td>
                  <td>{renderTimeCell(slot.time)}</td>
                  <td>{slot.available ? t("calendar.table.yes") : t("calendar.table.no")}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ServiceCalendar;