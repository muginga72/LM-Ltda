import React, { useEffect, useRef, useState } from "react";
import ServiceCardWithModals from "./ServiceCardWithModals";

const ENV_BASE = process.env.REACT_APP_API_BASE || "";
const BASE = ENV_BASE.replace(/\/$/, "");
const ENDPOINT = BASE ? `${BASE}/api/services` : `/api/services`;
const PRIMARY_COLOR = "#0d6efd";

function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(false);

  // Normalize many possible API shapes into an array of service objects
  const extractServices = (payload) => {
    if (!payload) return [];

    if (Array.isArray(payload)) return payload;

    if (Array.isArray(payload.services)) return payload.services;

    if (payload.data) {
      if (Array.isArray(payload.data.services)) return payload.data.services;
      if (Array.isArray(payload.data)) return payload.data;
    }

    if (payload.results) {
      if (Array.isArray(payload.results.services)) return payload.results.services;
      if (Array.isArray(payload.results)) return payload.results;
    }

    if (payload.services && typeof payload.services === "object") {
      if (Array.isArray(payload.services.services)) return payload.services.services;
      if (Array.isArray(payload.services.items)) return payload.services.items;
    }

    if (Array.isArray(payload.items)) return payload.items;

    if (typeof payload === "object" && (payload._id || payload.id || payload.title)) return [payload];

    return [];
  };

  // Deduplicate services by id or title
  const dedupeServices = (arr) => {
    const map = new Map();
    for (const s of arr || []) {
      const id = s && (s._id || s.id || s.slug || s.title);
      const key = id != null ? String(id) : JSON.stringify(s);
      if (!map.has(key)) {
        map.set(key, s);
      }
    }
    return Array.from(map.values());
  };

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(ENDPOINT, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "same-origin",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}${txt ? ` ${txt}` : ""}`);
      }

      const json = await res.json().catch(() => null);
      const extracted = extractServices(json);
      const normalized = dedupeServices(extracted);

      if (!mountedRef.current) return;

      setServices(normalized);

      if (normalized.length === 0) {
        console.warn("Services endpoint returned no services after normalization. Response payload:", json);
      } else {
        console.info(`Loaded ${normalized.length} unique services from ${ENDPOINT}`);
      }
    } catch (err) {
      console.error("load services error:", err);
      if (mountedRef.current) setError(err.message || "Failed to load services");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retryButtonStyle = {
    padding: "0.5rem 1rem",
    cursor: "pointer",
    borderRadius: 24,
    background: "transparent",
    color: PRIMARY_COLOR,
    border: `2px solid ${PRIMARY_COLOR}`,
    outline: "none",
    fontWeight: 600,
  };

  if (loading) return <div>Loading services…</div>;

  if (error)
    return (
      <div>
        <div style={{ marginBottom: 8, color: "crimson" }}>
          <strong>Error loading services:</strong> {error}
        </div>
        <div>
          <button onClick={load} style={retryButtonStyle}>
            Retry
          </button>
        </div>
      </div>
    );

  if (!services || services.length === 0)
    return (
      <div>
        <div>No services found</div>
        <div style={{ marginTop: 8 }}>
          <button onClick={load} style={retryButtonStyle}>
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div
      className="services-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1rem",
      }}
    >
      {services.map((svc) => {
        // Defensive mapping: ensure required fields exist
        const id = svc._id || svc.id || svc.slug || svc.title;
        const title = svc.title || svc.name || "Untitled service";
        const description = svc.description || svc.summary || "";
        const price = svc.price ?? svc.cost ?? null;
        const imagePath = svc.imagePath || svc.image || svc.imageUrl || svc.thumbnail || "";

        return (
          <ServiceCardWithModals
            key={id || title}
            serviceId={id || title}
            title={title}
            description={description}
            price={price}
            imagePath={imagePath}
          />
        );
      })}
    </div>
  );
}

export default ServicesList;
