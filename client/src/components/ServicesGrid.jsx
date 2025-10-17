import React, { useEffect, useState } from 'react';
import { fetchServices } from '../api/servicesApi';
import ServiceCard from './ServiceCard';

function ServicesGrid() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchServices()
      .then(data => { if (mounted) { setServices(data); setError(null); } })
      .catch(err => { if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => mounted = false;
  }, []);

  if (loading) return <div className="text-center py-5">Loading services…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (services.length === 0) return <div className="text-center py-5 text-muted">No services available</div>;

  return (
    <div className="container">
      <div className="row g-3">
        {services.map(s => (
          <div className="col-12 col-sm-6 col-md-4" key={s._id}>
            <ServiceCard service={s} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicesGrid;