import React from 'react';
import { useTranslation } from 'react-i18next';

function ServiceCard({ service }) {
  const { t, i18n } = useTranslation();

  // Static conversion rates (can be replaced with live rates via context or API)
  const conversionRates = {
    EUR: 0.8615,   // USD → EUR
    AOA: 912.085,  // USD → AOA
    USD: 1,
  };

  const getCurrency = (locale) => {
    if (locale.startsWith("pt")) return "AOA";
    if (locale.startsWith("fr")) return "EUR";
    return "USD";
  };

  const formatPrice = (usdValue) => {
    if (!usdValue) return "";
    const locale = i18n.language || "en-US";
    const currency = getCurrency(locale);
    const convertedValue = Number(usdValue) * conversionRates[currency];

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(convertedValue);
  };

  const translateTitle = (rawTitle) =>
    t(`service.${rawTitle}.title`, { defaultValue: rawTitle });

  const translateDescription = (rawTitle, rawDescription) =>
    t(`service.${rawTitle}.description`, { defaultValue: rawDescription });

  return (
    <div className="card h-100">
      {service.imagePath ? (
        <img
          src={service.imagePath}
          className="card-img-top"
          alt={service.title}
          style={{ objectFit: 'cover', height: 180 }}
        />
      ) : (
        <div
          className="bg-light d-flex align-items-center justify-content-center"
          style={{ height: 180 }}
        >
          <span className="text-muted">No image</span>
        </div>
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{translateTitle(service.title)}</h5>
        <p className="card-text flex-grow-1">
          {translateDescription(service.title, service.description)}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <strong>{formatPrice(service.price?.toFixed(2) ?? '0.00')}</strong>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;