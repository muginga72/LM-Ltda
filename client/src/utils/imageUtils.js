// src/utils/imageUtils.js
export const API_BASE = process.env.REACT_APP_API_BASE || "";

export function resolveRoomImage(img) {
  if (!img) return null;

  // If API returned an object with url
  if (typeof img === "object") {
    if (img.url && typeof img.url === "string") {
      if (/^https?:\/\//i.test(img.url)) return img.url;
      if (img.url.startsWith("/")) return `${API_BASE}${img.url}`;
      return `${API_BASE}/uploads/rooms/${img.filename || img.url}`;
    }
    if (img.filename) return `${API_BASE}/uploads/rooms/${img.filename}`;
    if (img.path) {
      const parts = img.path.split(/[\\/]/);
      const filename = parts[parts.length - 1];
      return `${API_BASE}/uploads/rooms/${filename}`;
    }
  }

  // If img is a string
  if (typeof img === "string") {
    if (/^https?:\/\//i.test(img)) return img;
    if (img.startsWith("/")) return `${API_BASE}${img}`;
    return `${API_BASE}/uploads/rooms/${img}`;
  }

  return null;
}