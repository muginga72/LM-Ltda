import React, { useCallback, useEffect, useRef, useState } from "react";
import ServiceCardWithModals from "./ServiceCardWithModals";

const ENV_BASE = process.env.REACT_APP_API_URL || "";
const BASE = ENV_BASE.replace(/\/$/, ""); // remove trailing slash if present
const DEFAULT_TIMEOUT_MS = 10000; // 10s timeout

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(false);

  const getEndpoint = useCallback(() => {
    if (BASE) return `${BASE}/api/services`;
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

  const loadServices = useCallback(
    async ({ signal, timeoutMs = DEFAULT_TIMEOUT_MS, includeCredentials = false } = {}) => {
      setLoading(true);
      setError(null);

      let timeoutId = null;
      if (timeoutMs > 0) {
        timeoutId = setTimeout(() => {

          try {
            console.info("loadServices timeout reached");
          } catch (e) {
            // ignore
          }
        }, timeoutMs);
      }

      try {
        const endpoint = getEndpoint();

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

        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Failed to load services: ${res.status}${txt ? ` ${txt}` : ""}`);
        }

        const data = await res.json().catch(() => null);

        if (!mountedRef.current) return;

        const normalized = normalizeResponseToArray(data);
        setServices(normalized);
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
    [getEndpoint]
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
            onClick={() => {
              const controller = new AbortController();
              loadServices({ signal: controller.signal });
            }}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
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
          <button
            onClick={() => {
              const controller = new AbortController();
              loadServices({ signal: controller.signal });
            }}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
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