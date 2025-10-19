import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { ServiceCardWithModals } from "./ServiceCardWithModals";

const ServiceGallery = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from backend + localStorage
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const dbServices = await res.json();

        // Load local-only services
        const localServices =
          JSON.parse(localStorage.getItem("localServices")) || [];

        // Merge them
        setServices([...dbServices, ...localServices]);
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };
    fetchServices();
  }, []);

  // Delete handler for both local-only and backend cards
  const handleDelete = async (id, isLocal) => {
    if (isLocal) {
      // Remove from state and localStorage
      const updated = services.filter((s) => s._id !== id);
      setServices(updated);
      const localServices = updated.filter((s) => s.isLocal);
      localStorage.setItem("localServices", JSON.stringify(localServices));
    } else {
      try {
        setLoading(true);
        const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete service");
        const updated = services.filter((s) => s._id !== id);
        setServices(updated);
      } catch (err) {
        console.error("Error deleting service:", err);
        alert("Failed to delete service. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading services...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center my-5">
        <p>No services available.</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <div className="row g-4">
        {services.map((service) => (
          <div key={service._id} className="col-12 col-md-6">
            <ServiceCardWithModals service={service} onDelete={handleDelete} />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ServiceGallery;