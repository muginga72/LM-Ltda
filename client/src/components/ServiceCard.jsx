import React from 'react';

function ServiceCard({ 
  service, 
  // onClick 
}) {
  return (
    <div className="card h-100">
      {service.imagePath ? (
        <img src={service.imagePath} className="card-img-top" alt={service.title} style={{ objectFit: 'cover', height: 180 }} />
      ) : (
        <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 180 }}>
          <span className="text-muted">No image</span>
        </div>
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{service.title}</h5>
        <p className="card-text flex-grow-1">{service.description}</p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <strong>${service.price?.toFixed(2) ?? '0.00'}</strong>
          {/* <button className="btn btn-sm btn-outline-primary" onClick={() => onClick && onClick(service)}>View</button> */}
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;