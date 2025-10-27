// src/components/ProofAttachment.jsx — no react-pdf needed
import React from "react";

const PROMO_IMAGES = [
  "/promo/promo-1.jpg",
  "/promo/promo-2.jpg",
  "/promo/promo-3.jpg",
];

const isAbsoluteUrl = (p) => /^https?:\/\//i.test(p);

const normalizePath = (p) => {
  if (!p) return "";
  if (isAbsoluteUrl(p)) return p;
  if (p.startsWith("/")) return p;
  return `/uploads/${p}`;
};

const extractFileName = (p) => {
  if (!p) return "";
  try {
    if (isAbsoluteUrl(p)) {
      const u = new URL(p);
      return decodeURIComponent(u.pathname.split("/").pop() || p);
    }
    return decodeURIComponent(p.split("/").pop() || p);
  } catch {
    return p;
  }
};

const ProofAttachment = ({ filePath, serviceTitle }) => {
  const hasFile = !!filePath;
  const url = normalizePath(filePath);
  const filename = extractFileName(filePath || "");
  const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(filename);
  const isPDF = /\.pdf$/i.test(filename);

  return (
    <div className="proof-attachment mt-2">
      <h6 style={{ marginBottom: 8 }}>
        Proof of Payment{serviceTitle ? ` — ${serviceTitle}` : ""}
      </h6>

      {!hasFile ? (
        <>
          <p className="text-muted" style={{ marginBottom: 12 }}>
            Proof not found for "{serviceTitle || "this service"}". While you re-upload,
            here are a few highlights from LM Services Ltd.
          </p>

          <div
            className="promo-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
              alignItems: "start",
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
                  minHeight: 90,
                }}
              >
                <img
                  src={src}
                  alt={`Promo ${i + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <small className="text-muted">
              <strong>Tip: </strong>Re-upload your proof using the Upload Proof button on the service card.
            </small>
          </div>
        </>
      ) : (
        <>
          {isImage ? (
            <img
              src={url}
              alt={`Proof for ${serviceTitle || "service"}`}
              style={{
                maxWidth: "100%",
                border: "1px solid #ccc",
                borderRadius: 4,
                marginBottom: 10,
                display: "block",
              }}
            />
          ) : isPDF ? (
            <div style={{ marginBottom: 8 }}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                📄 View PDF Proof
              </a>
            </div>
          ) : (
            <div style={{ marginBottom: 8 }}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm">
                📎 Download Attachment
              </a>
            </div>
          )}

          <div style={{ fontSize: 13, color: "#555" }}>
            <strong>File:</strong> {filename || "attachment"}{" "}
            {isPDF && <span style={{ marginLeft: 8, color: "#777" }}>PDF</span>}
          </div>
        </>
      )}
    </div>
  );
};

export default ProofAttachment;