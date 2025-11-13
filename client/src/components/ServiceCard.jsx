import React from 'react';
import { useTranslation } from 'react-i18next';

function ServiceCard({ service }) {
  const { t, i18n } = useTranslation();

  const formatPrice = (value) => {
    if (!value) return "";
    const locale = i18n.language || "en-US";
    const currency = locale.startsWith("pt")
      ? "AOA"
      : locale.startsWith("fr")
      ? "EUR"
      : "USD";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(value));
  };

  const translateTitle = (rawTitle) =>
    t(`service.${rawTitle}.title`, { defaultValue: rawTitle });

  const translateDescription = (rawTitle, rawDescription) =>
    t(`service.${rawTitle}.description`, { defaultValue: rawDescription });
  
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
        <h5 className="card-title">{translateTitle(service.title)}</h5>
        <p className="card-text flex-grow-1">{translateDescription(service.title, service.description)}</p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <strong>{formatPrice(service.price?.toFixed(2) ?? '0.00')}</strong>
          {/* <button className="btn btn-sm btn-outline-primary" onClick={() => onClick && onClick(service)}>View</button> */}
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;