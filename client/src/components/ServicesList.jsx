import React, { useCallback, useEffect, useRef, useState } from "react";
import ServiceCardWithModals from "./ServiceCardWithModals";

const ENV_BASE = process.env.REACT_APP_API_BASE || "";
const BASE = ENV_BASE.replace(/\/$/, "");
const DEFAULT_ENDPOINT = BASE ? `${BASE}/api/services` : `/api/services`;
const PRIMARY_COLOR = "#0d6efd";

function ServicesList({ endpoint = DEFAULT_ENDPOINT }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(false);
  const abortRef = useRef(null);

  // Normalize many possible API shapes into an array of service objects
  const extractServices = useCallback((payload) => {
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

    if (typeof payload === "object" && (payload._id || payload.id || payload.title || payload.name)) return [payload];

    return [];
  }, []);

  // Deduplicate services by id or title
  const dedupeServices = useCallback((arr) => {
    const map = new Map();
    for (const s of arr || []) {
      const id = s && (s._id || s.id || s.slug || s.title || s.name);
      const key = id != null ? String(id) : JSON.stringify(s);
      if (!map.has(key)) {
        map.set(key, s);
      }
    }
    return Array.from(map.values());
  }, []);

  const load = useCallback(async () => {
    // Abort any previous in-flight request
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch (e) {
        /* ignore */
      }
      abortRef.current = null;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "same-origin",
        signal: controller.signal,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}${txt ? ` ${txt}` : ""}`);
      }

      // Read text then try to parse JSON defensively
      let json = null;
      try {
        const text = await res.text();
        json = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        // If parsing from text failed, try res.json() as a fallback
        try {
          json = await res.json();
        } catch {
          json = null;
        }
      }

      const extracted = extractServices(json);
      const normalized = dedupeServices(extracted);

      if (!mountedRef.current) return;

      setServices(normalized);

      if (normalized.length === 0) {
        console.warn("Services endpoint returned no services after normalization. Response payload:", json);
      } else {
        // eslint-disable-next-line no-console
        console.info(`Loaded ${normalized.length} unique services from ${endpoint}`);
      }
    } catch (err) {
      if (err && err.name === "AbortError") {
        return;
      }

      // eslint-disable-next-line no-console
      console.error("load services error:", err);

      if (mountedRef.current) {
        setError(err.message || "Failed to load services");
        setServices([]); // keep UI stable
      }
    } finally {
      if (mountedRef.current) setLoading(false);
      if (abortRef.current === controller) abortRef.current = null;
    }
  }, [endpoint, extractServices, dedupeServices]);

  useEffect(() => {
    mountedRef.current = true;
    load();

    return () => {
      mountedRef.current = false;
      if (abortRef.current) {
        try {
          abortRef.current.abort();
        } catch (e) {
          /* ignore */
        }
        abortRef.current = null;
      }
    };
  }, [load]);

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
      {services.map((svc, idx) => {
        // Defensive mapping: ensure required fields exist
        const id = svc && (svc._id || svc.id || svc.slug || svc.title || svc.name);
        const title = (svc && (svc.title || svc.name)) || "Untitled service";
        const description = (svc && (svc.description || svc.summary)) || "";
        const price = svc && (svc.price ?? svc.cost ?? null);
        const imagePath = svc && (svc.imagePath || svc.image || svc.imageUrl || svc.thumbnail || "");

        return (
          <ServiceCardWithModals
            key={id || title || idx}
            serviceId={id || title || idx}
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