import React, { useCallback, useEffect, useRef, useState } from "react";
import ServiceCardWithModals from "./ServiceCardWithModals";

// Build default endpoint from env safely
const ENV_BASE = process.env.REACT_APP_API_BASE || "";
const BASE = ENV_BASE.replace(/\/$/, "");
const DEFAULT_ENDPOINT = BASE ? `${BASE}/api/services` : "/api/services";
const PRIMARY_COLOR = "#0d6efd";

function ServicesList({ endpoint: endpointProp }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(false);
  const abortRef = useRef(null);

  // Resolve endpoint order: prop -> env -> runtime window config -> default
  const resolveEndpoint = useCallback(() => {
    if (endpointProp) return endpointProp;
    if (BASE) return `${BASE}/api/services`;

    try {
      const runtime = typeof window !== "undefined" ? window.__ENV__ : null;
      if (runtime && runtime.API_BASE) {
        return `${runtime.API_BASE.replace(/\/$/, "")}/api/services`;
      }
    } catch {}
    return DEFAULT_ENDPOINT;
  }, [endpointProp]);

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

    if (typeof payload === "object" && (payload._id || payload.id || payload.title || payload.name)) {
      return [payload];
    }

    return [];
  }, []);

  const normalizeServices = useCallback((arr, rawPayload) => {
    if (!Array.isArray(arr)) {
      console.warn("Services endpoint returned no services after normalization. Response payload:", rawPayload);
      return [];
    }
    return arr;
  }, []);

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

  // Robust response parsing
  const parseResponseSafely = useCallback(async (res) => {
    try {
      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      if (contentType.includes("application/json")) {
        const j = await res.json().catch(() => null);
        if (j !== null && j !== undefined) return j;
      }
      const txt = await res.text().catch(() => "");
      if (!txt) return null;
      try {
        return JSON.parse(txt);
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }, []);

  const load = useCallback(
    async (opts = { retry: true }) => {
      const endpoint = resolveEndpoint();

      if (abortRef.current) {
        try {
          abortRef.current.abort();
        } catch {}
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
          let errText = `HTTP ${res.status}`;
          try {
            const errBody = await res.json();
            errText += errBody?.message ? ` ${errBody.message}` : ` ${JSON.stringify(errBody)}`;
          } catch {
            const txt = await res.text().catch(() => "");
            if (txt) errText += ` ${txt}`;
          }
          throw new Error(errText);
        }

        const payload = await parseResponseSafely(res);

        // If payload is null and retry allowed, try one more time
        if ((payload === null || payload === undefined) && opts.retry) {
          await new Promise((r) => setTimeout(r, 300));
          return load({ retry: false });
        }

        const extracted = extractServices(payload);
        const normalized = normalizeServices(extracted, payload);
        const unique = dedupeServices(normalized);

        if (unique.length === 0) {
          // If no services found, log the original payload once
          if (!Array.isArray(extracted) || extracted.length === 0) {
            console.warn("Services endpoint returned no services after normalization. Response payload:", payload);
          }
        } else {
          console.info(`Loaded ${unique.length} unique services from ${endpoint}`);
        }

        if (!mountedRef.current) return;
        setServices(unique);
      } catch (err) {
        if (err?.name === "AbortError") return;

        console.error("load services error:", err);

        if (mountedRef.current) {
          setError(
            // Provide a helpful message that hints at common build-time issues
            `${err.message || "Falha ao carregar serviços."} If this is a static build, ensure the API base URL is configured at build time or injected at runtime.`
          );
          setServices([]);
        }
      } finally {
        if (mountedRef.current) setLoading(false);
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [resolveEndpoint, parseResponseSafely, extractServices, normalizeServices, dedupeServices]
  );

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => {
      mountedRef.current = false;
      if (abortRef.current) {
        try {
          abortRef.current.abort();
        } catch {}
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

  if (loading) return <div>Carregando serviços...</div>;

  if (error)
    return (
      <div>
        <div style={{ marginBottom: 8, color: "crimson" }}>
          <strong>Falha ao carregar serviços:</strong> {error}
        </div>
        <button onClick={() => load({ retry: true })} style={retryButtonStyle}>
          Tentar novamente
        </button>
      </div>
    );

  if (!services || services.length === 0)
    return (
      <div>
        <div>Nenhum serviço encontrado</div>
        <button onClick={() => load({ retry: true })} style={{ ...retryButtonStyle, marginTop: 8 }}>
          Tentar novamente
        </button>
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