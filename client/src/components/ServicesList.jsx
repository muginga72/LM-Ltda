import React, { useCallback, useEffect, useRef, useState } from "react";
import ServiceCardWithModals from "./ServiceCardWithModals";

const ENV_BASE = process.env.REACT_APP_API_URL || "";
const BASE = ENV_BASE.replace(/\/$/, ""); // remove trailing slash if present
const DEFAULT_TIMEOUT_MS = 10000; // 10s timeout

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  // build endpoint: prefer configured base, otherwise use same-origin relative path
  const getEndpoint = useCallback(() => {
    if (BASE) return `${BASE}/api/services`;
    return `/api/services`;
  }, []);

  const loadServices = useCallback(
    async (opts = {}) => {
      const { timeoutMs = DEFAULT_TIMEOUT_MS, includeCredentials = false } = opts;
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const signal = controller.signal;

      // timeout abort
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const endpoint = getEndpoint();

        // If the page is HTTPS and the endpoint is explicitly HTTP, warn in console
        if (typeof window !== "undefined" && endpoint.startsWith("http://") && window.location.protocol === "https:") {
          console.warn(
            "Requesting an insecure HTTP API from an HTTPS page may be blocked by the browser (mixed content). Use HTTPS for the API."
          );
        }

        const res = await fetch(endpoint, {
          method: "GET",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: includeCredentials ? "include" : "same-origin",
          signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          // Try to read text for better error message, but don't crash if body can't be read
          const txt = await res.text().catch(() => "");
          throw new Error(`Failed to load services: ${res.status}${txt ? ` ${txt}` : ""}`);
        }

        const data = await res.json().catch(() => null);

        if (!mountedRef.current) return;

        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        // AbortError is expected on timeout/cleanup
        if (err.name === "AbortError") {
          console.info("loadServices aborted or timed out");
          if (mountedRef.current) setError("Request timed out or was cancelled");
          return;
        }

        console.error("loadServices error:", err);
        if (mountedRef.current) setError(err.message || "Failed to load services");
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [getEndpoint]
  );

  useEffect(() => {
    mountedRef.current = true;
    // initial load
    loadServices();

    return () => {
      mountedRef.current = false;
    };
  }, [loadServices]);

  // UI states
  if (loading) return <div>Loading services…</div>;
  if (error)
    return (
      <div>
        <div style={{ marginBottom: 8, color: "crimson" }}>
          <strong>Error loading services:</strong> {error}
        </div>
        <div>
          <button
            onClick={() => { loadServices();}}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  if (!services.length) return <div>No services found</div>;

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