// src/components/roomrentals/RoomDetails.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { resolveRoomImage } from "../../utils/imageUtils";

const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'>
      <rect width='100%' height='100%' fill='#f3f3f3'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-size='16'>No image</text>
    </svg>`
  );

const conversionRates = {
  EUR: 0.8615, // 1 USD = 0.8615 EUR
  AOA: 912.085, // 1 USD = 912.085 AOA
  USD: 1,
};

function localeForLang(lang) {
  if (!lang) return "en-US";
  const l = String(lang).toLowerCase();
    if (l.startsWith("pt")) return "pt-PT";
    if (l.startsWith("fr")) return "fr-FR";
  return "en-US";
}

export function formatEuropeanDateTime(value, lang) {
  if (!value) return "";
  const locale = localeForLang(lang);
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDate(dateLike, lang) {
  if (!dateLike) return "";
  const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "";
  const intlLocale = localeForLang(lang);
  const dateFormatter = new Intl.DateTimeFormat(intlLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return dateFormatter.format(date);
}

export function formatTime(dateLike, lang) {
  if (!dateLike) return "";
  const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "";
  const intlLocale = localeForLang(lang);
  const timeFormatter = new Intl.DateTimeFormat(intlLocale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return timeFormatter.format(date);
}

function targetCurrencyForLang(lang) {
  const l = String(lang || "en").toLowerCase();
  if (l.startsWith("fr")) return "EUR";
  if (l.startsWith("pt")) return "AOA";
  // default target for other languages: USD
  return "USD";
}

export function formatCurrency(value, currency, lang) {
  const target = targetCurrencyForLang(lang);
  const intlLocale = localeForLang(lang);

  if (value == null) return "";

  // Normalize currency codes
  const from = currency ? String(currency).toUpperCase() : null;
  const to = String(target).toUpperCase();

  // If no source currency provided, just format the number
  if (!from) {
    try {
      return new Intl.NumberFormat(intlLocale, {
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return String(value);
    }
  }

  // If same currency, format directly
  if (from === to) {
    try {
      return new Intl.NumberFormat(intlLocale, {
        style: "currency",
        currency: to,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${value} ${to}`;
    }
  }

  const rateFrom = conversionRates[from];
  const rateTo = conversionRates[to];

  // If we don't have rates for either currency, fall back to formatting original value with its code
  if (typeof rateFrom !== "number" || typeof rateTo !== "number") {
    try {
      return new Intl.NumberFormat(intlLocale, {
        style: "currency",
        currency: from,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${value} ${from}`;
    }
  }

  const converted = (value / rateFrom) * rateTo;

  try {
    return new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: to,
      maximumFractionDigits: 2,
    }).format(converted);
  } catch {
    return `${converted.toFixed(2)} ${to}`;
  }
}

function localizedField(obj, baseKey, lang) {
  if (!obj) return null;
  const l = (lang || "en").split("-")[0];

  const translationsMap = obj[`${baseKey}Translations`];
  if (translationsMap && typeof translationsMap === "object") {
    if (translationsMap[lang]) return translationsMap[lang];
    if (translationsMap[l]) return translationsMap[l];
  }

  if (obj[`${baseKey}_${lang}`]) return obj[`${baseKey}_${lang}`];
  if (obj[`${baseKey}_${l}`]) return obj[`${baseKey}_${l}`];
  if (obj[baseKey]) return obj[baseKey];
  return null;
}

const RoomDetails = function RoomDetailsComponent({
  show,
  onClose,
  room: roomProp,
  fetchUrl = null,
  token,
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n?.language ?? "en";

  const [room, setRoom] = useState(roomProp ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keep local room in sync when parent provides a new room prop
  useEffect(() => {
    setRoom(roomProp ?? null);
    setError("");
  }, [roomProp]);

  // Fetch when modal opens and we don't already have room data
  useEffect(() => {
    if (!show) return;
    if (roomProp) return;
    if (!fetchUrl) return;

    let mounted = true;
    const controller = new AbortController();
    setLoading(true);
    setError("");

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(fetchUrl, {
      headers,
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (mounted) setRoom(data);
      })
      .catch((err) => {
        if (!mounted) return;
        if (err.name === "AbortError") return;
        setError(err.message || t("failedToLoad"));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [show, fetchUrl, roomProp, token, t]);

  // Close on Escape
  useEffect(() => {
    if (!show) return;
    function onKey(e) {
      if (e.key === "Escape") {
        if (typeof onClose === "function") onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  if (!show) return null;

  if (loading) {
    return (
      <>
        <div className="modal-backdrop fade show" />
        <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("loading")}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
              </div>
              <div className="modal-body">
                <div className="text-center py-4">{t("loadingRoomDetails")}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="modal-backdrop fade show" />
        <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("error")}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
              </div>
              <div className="modal-body">
                <div className="alert alert-danger">{error}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!room) {
    return (
      <>
        <div className="modal-backdrop fade show" />
        <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("noData")}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
              </div>
              <div className="modal-body">
                <div className="text-muted">{t("noRoomData")}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const images = Array.isArray(room.images)
    ? room.images.map(resolveRoomImage).filter(Boolean)
    : room.images
    ? [resolveRoomImage(room.images)].filter(Boolean)
    : [];

  const localizedTitle =
    localizedField(room, "title", lang) ??
    localizedField(room, "roomTitle", lang) ??
    room.name ??
    t("untitledRoom");

  const localizedDescription =
    localizedField(room, "description", lang) ??
    localizedField(room, "roomDescription", lang) ??
    t("noDescription");

  // Extract location similar to RoomCardWithPay
  const address =
    room?.roomLocation?.address?.address ??
    room?.roomLocation?.address ??
    room?.address ??
    "";

  const city =
    room?.roomLocation?.address?.city ??
    room?.roomLocation?.city ??
    room?.city ??
    "";

  const region =
    room?.roomLocation?.address?.region ??
    room?.roomLocation?.region ??
    room?.region ??
    "";

  const country =
    room?.roomLocation?.address?.country ??
    room?.roomLocation?.country ??
    room?.country ??
    "";

  const locParts = [address, city, region, country].filter(Boolean);
  const locationString = locParts.length ? locParts.join(", ") : "";

  function backdropClick(e) {
    const target = e.target;
    if (target && target.classList && target.classList.contains("modal")) {
      if (typeof onClose === "function") onClose();
    }
  }

  // Format availability dates if present (European format via local helpers)
  const availableFrom = room.availableFrom ? formatEuropeanDateTime(room.availableFrom, lang) : null;
  const availableTo = room.availableTo ? formatEuropeanDateTime(room.availableTo, lang) : null;

  // Price formatting using local helper (converts to currency appropriate for language)
  const priceAmount = room?.pricePerNight?.amount ?? room?.price ?? null;
  const priceCurrency = room?.pricePerNight?.currency ?? room?.currency ?? null;
  const formattedPrice =
    priceAmount != null ? formatCurrency(priceAmount, priceCurrency, lang) : t("nA");

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div
        className="modal d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        onMouseDown={backdropClick}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{localizedTitle}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    {images.length ? (
                      <div className="mb-3">
                        {images.map((src, i) => (
                          <img
                            key={i}
                            src={src || PLACEHOLDER}
                            alt={`${localizedTitle} ${i + 1}`}
                            className="img-fluid mb-2"
                            style={{
                              width: "100%",
                              height: 300,
                              objectFit: "cover",
                              display: "block",
                              borderRadius: "24px",
                            }}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = PLACEHOLDER;
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-light p-5 text-center">{t("noImages")}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <h6>{t("description")}</h6>
                    <p>{localizedDescription}</p>

                    {locationString && (
                      <>
                        <h6>{t("location")}</h6>
                        <div className="text-muted mb-3">{locationString}</div>
                      </>
                    )}

                    {availableFrom || availableTo ? (
                      <>
                        <h6>{t("availability")}</h6>
                        <div className="text-muted mb-3">
                          {availableFrom ? `${t("from")}: ${availableFrom}` : ""}
                          {availableFrom && availableTo ? " — " : ""}
                          {availableTo ? `${t("to")}: ${availableTo}` : ""}
                        </div>
                      </>
                    ) : null}

                    <h6>{t("details")}</h6>
                    <ul>
                      <li>
                        <strong>{t("price")}: </strong>
                        {formattedPrice}
                      </li>
                      <li>
                        <strong>{t("capacity")}: </strong>
                        {room.roomCapacity ?? room.capacity ?? "-"} {t("guests")}
                      </li>
                      <li>
                        <strong>{t("bedrooms")}: </strong>
                        {room.bedrooms ?? "-"}
                      </li>
                      <li>
                        <strong>{t("bathrooms")}: </strong>
                        {room.bathrooms ?? "-"}
                      </li>
                    </ul>

                    {room.amenities && room.amenities.length > 0 && (
                      <>
                        <h6>{t("amenities")}</h6>
                        <ul>
                          {room.amenities.map((a, idx) => (
                            <li key={idx}>{a}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {room.rules && room.rules.length > 0 && (
                      <>
                        <h6>{t("rules")}</h6>
                        <ul>
                          {room.rules.map((r, idx) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

RoomDetails.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  room: PropTypes.object,
  fetchUrl: PropTypes.string,
  token: PropTypes.string,
};

RoomDetails.defaultProps = {
  room: null,
  fetchUrl: null,
  token: null,
};

export default RoomDetails;