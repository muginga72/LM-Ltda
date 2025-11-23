import React from "react";

export default function AddRoomModal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20
      }}
      onMouseDown={onClose}
    >
      <div
        role="document"
        style={{ background: "#fff", borderRadius: 8, maxWidth: 900, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: 18 }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>Add new room</h3>
          <button onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}