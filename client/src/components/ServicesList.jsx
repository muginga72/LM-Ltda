import React, { useEffect, useState } from "react";
import ServiceCardWithModals from "./ServiceCardWithModals";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let mounted = true;

    async function loadServices() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BASE}/api/services`, { signal });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Failed to load services: ${res.status} ${txt}`);
        }

        const data = await res.json();
        if (!mounted) return;

        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("loadServices error:", err);
        if (mounted) setError(err.message || "Failed to load services");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadServices();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  if (loading) return <div>Loading services…</div>;
  if (error) return <div>Error loading services: {error}</div>;
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