import React, { useCallback, useEffect, useRef, useState } from "react";
import ServiceCardWithModals from "./ServiceCardWithModals";

const ENV_BASE = process.env.REACT_APP_API_BASE || "";
const BASE = ENV_BASE.replace(/\/$/, ""); // remove trailing slash if present
const DEFAULT_TIMEOUT_MS = 10000; // 10s timeout
const BOOTSTRAP_PRIMARY = "#0d6efd"; // fallback primary color for outline

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(false);

  // build endpoint: prefer configured base, otherwise use same-origin relative path
  const getConfiguredEndpoint = useCallback(() => {
    if (BASE) return `${BASE}/api/services`;
    return null;
  }, []);

  const getSameOriginEndpoint = useCallback(() => {
    return `/api/services`;
  }, []);

  const normalizeResponseToArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.services)) return data.services;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.results)) return data.results;
    if (typeof data === "object" && (data._id || data.id)) return [data];
    return [];
  };

  const fetchFromEndpoints = useCallback(
    async (endpoints = [], signal) => {
      let lastError = null;

      for (let i = 0; i < endpoints.length; i++) {
        const endpoint = endpoints[i];
        try {
          if (!endpoint) continue;

          if (typeof window !== "undefined" && endpoint.startsWith("http://") && window.location.protocol === "https:") {
            console.warn(
              `Mixed content risk: requesting insecure HTTP API from HTTPS page: ${endpoint}. This may be blocked by the browser.`
            );
          }

          const res = await fetch(endpoint, {
            method: "GET",
            mode: "cors",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
            signal,
          });

          if (!res.ok) {
            const txt = await res.text().catch(() => "");
            throw new Error(`HTTP ${res.status}${txt ? ` ${txt}` : ""}`);
          }

          const data = await res.json().catch(() => null);
          return { data, endpoint };
        } catch (err) {
          lastError = err;
          // If it's an AbortError, rethrow so caller can handle cleanup
          if (err && err.name === "AbortError") throw err;

          // If it's a network-level failure (TypeError: Failed to fetch), try next endpoint
          if (err instanceof TypeError || (err.message && err.message.toLowerCase().includes("failed to fetch"))) {
            console.warn(`Network fetch failed for ${endpoint}: ${err.message}. Trying next endpoint if available.`);
            continue;
          }

          throw err;
        }
      }

      throw lastError || new Error("No endpoints available to fetch services");
    },
    []
  );

  const loadServices = useCallback(
    async ({ signal, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) => {
      setLoading(true);
      setError(null);

      let timeoutId = null;
      if (timeoutMs > 0) {
        timeoutId = setTimeout(() => {

          console.info("loadServices timeout reached");
        }, timeoutMs);
      }

      try {
        const endpoints = [];
        const configured = getConfiguredEndpoint();
        const sameOrigin = getSameOriginEndpoint();

        if (configured) endpoints.push(configured);
        if (!configured || configured !== sameOrigin) endpoints.push(sameOrigin);

        const { data, endpoint } = await fetchFromEndpoints(endpoints, signal);

        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        if (!mountedRef.current) return;

        const normalized = normalizeResponseToArray(data);
        setServices(normalized);
        setError(null);

        console.info(`Loaded services from ${endpoint}`);
      } catch (err) {
        if (err && err.name === "AbortError") {
          console.info("loadServices aborted");
          if (mountedRef.current) setError("Request was cancelled");
          return;
        }

        console.error("loadServices error:", err);
        if (mountedRef.current) setError(err?.message || "Failed to load services");
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [fetchFromEndpoints, getConfiguredEndpoint, getSameOriginEndpoint]
  );

  useEffect(() => {
    mountedRef.current = true;
    const controller = new AbortController();

    loadServices({ signal: controller.signal });

    return () => {
      mountedRef.current = false;
      controller.abort();
    };
  }, [loadServices]);

  const retryLoad = useCallback(() => {
    const controller = new AbortController();
    loadServices({ signal: controller.signal });
  }, [loadServices]);

  const retryButtonStyle = {
    padding: "0.5rem 1rem",
    cursor: "pointer",
    borderRadius: 24,
    background: "transparent",
    color: BOOTSTRAP_PRIMARY,
    border: `2px solid ${BOOTSTRAP_PRIMARY}`,
    outline: "none",
    fontWeight: 600,
  };

  // UI states
  if (loading) return <div>Loading services…</div>;

  if (error)
    return (
      <div>
        <div style={{ marginBottom: 8, color: "crimson" }}>
          <strong>Error loading services:</strong> {error}
        </div>
        <div>
          <button onClick={retryLoad} style={retryButtonStyle}>
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
          <button onClick={retryLoad} style={retryButtonStyle}>
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div
      className="services-grid gap-4"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1rem",
      }}
    >
      {services.map((svc) => (
        <ServiceCardWithModals
          key={svc._id || svc.id || svc.title}
          serviceId={svc._id || svc.id}
          title={svc.title}
          description={svc.description}
          price={svc.price}
          imagePath={svc.imagePath}
        />
      ))}
    </div>
  );
};

export default ServicesList;