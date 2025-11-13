// src/components/ProofAttachment.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const PROMO_IMAGES = [
  "/promo/promo-1.jpg",
  "/promo/promo-2.jpg",
  "/promo/promo-3.jpg"
];

const isAbsoluteUrl = (p) => typeof p === "string" && /^https?:\/\//i.test(p);

const normalizePath = (p) => {
  if (!p) return "";
  if (isAbsoluteUrl(p)) return p;
  if (typeof p === "string" && p.startsWith("/")) return p;
  return `/uploads/${p}`;
};

const extractFileName = (p) => {
  if (!p) return "";
  try {
    if (isAbsoluteUrl(p)) {
      const u = new URL(p, window.location.origin);
      return decodeURIComponent((u.pathname || "").split("/").pop() || p);
    }
    return decodeURIComponent(String(p).split("/").pop() || String(p));
  } catch {
    return String(p);
  }
};

const formatDateTime = (isoOrDate, locale) => {
  if (!isoOrDate) return null;
  try {
    const dt =
      typeof isoOrDate === "string" && isoOrDate.includes("T")
        ? new Date(isoOrDate)
        : new Date(isoOrDate);
    if (Number.isNaN(dt.getTime())) return null;
    return new Intl.DateTimeFormat(locale || navigator.language || "en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(dt);
  } catch {
    return null;
  }
};

const ProofAttachment = ({ filePath, serviceTitle, uploadedAt }) => {
  const { t, i18n } = useTranslation();

  // Translate service title if a translation exists, otherwise show raw title
  const translateServiceTitle = (raw) => {
    if (!raw) return "";
    const key = `service.${raw}.title`;
    const translated = t(key, { defaultValue: "__MISSING__" });
    return translated === "__MISSING__" ? raw : translated;
  };

  const displayedServiceTitle = translateServiceTitle(serviceTitle);

  const hasFile = Boolean(filePath);
  const url = normalizePath(filePath);
  const filename = extractFileName(filePath || "");
  const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(filename);
  const isPDF = /\.pdf$/i.test(filename);
  const locale = i18n.language || navigator.language || "en-US";
  const formattedUploadedAt = formatDateTime(uploadedAt, locale);

  return (
    <div className="proof-attachment mt-2">
      <h6 style={{ marginBottom: 8 }}>
        {t("proofTitle")}
        {displayedServiceTitle ? ` — ${displayedServiceTitle}` : ""}
      </h6>

      {!hasFile ? (
        <>
          <p className="text-muted" style={{ marginBottom: 12 }}>
            {t("proofNotFound", { service: displayedServiceTitle || t("proofNoService") })}
          </p>

          <div
            className="promo-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
              alignItems: "start"
            }}
          >
            {PROMO_IMAGES.map((src, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #e6e6e6",
                  borderRadius: 6,
                  overflow: "hidden",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 90
                }}
              >
                <img
                  src={src}
                  alt={t("proofImageAlt", { index: i + 1 })}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <small className="text-muted">
              <strong>{t("proofTipPrefix")}</strong> {t("proofTip")}
            </small>
          </div>
        </>
      ) : (
        <>
          {isImage ? (
            <img
              src={url}
              alt={t("proofImageForService", { service: displayedServiceTitle || "" })}
              style={{
                maxWidth: "100%",
                border: "1px solid #ccc",
                borderRadius: 4,
                marginBottom: 10,
                display: "block"
              }}
            />
          ) : isPDF ? (
            <div style={{ marginBottom: 8 }}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                📄 {t("proofViewPdf")}
              </a>
            </div>
          ) : (
            <div style={{ marginBottom: 8 }}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm">
                📎 {t("proofDownload")}
              </a>
            </div>
          )}

          <div style={{ fontSize: 13, color: "#555" }}>
            <strong>{t("proofFileLabel")}:</strong> {filename || t("proofUnknownFile")}
            <span style={{ marginLeft: 12, color: "#777" }}>
              {formattedUploadedAt ? `${t("proofUploadedAt")}: ${formattedUploadedAt}` : ` ${t("proofNoDate")}`}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ProofAttachment;