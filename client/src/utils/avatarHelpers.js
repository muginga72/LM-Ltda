// src/utils/avatarHelpers.js
export function resolveApiBase(apiBase = "") {
  if (apiBase && typeof apiBase === "string" && apiBase.trim() !== "") {
    try {
      return new URL(apiBase).toString();
    } catch {
      return apiBase;
    }
  }
  if (typeof window !== "undefined" && window.location) {
    return window.location.origin;
  }
  return "";
}

export function toAbsoluteUrl(maybeUrl, apiBase = "") {
  if (!maybeUrl) return "/avatar.png";
  try {
    return new URL(maybeUrl).toString();
  } catch {
    try {
      const base = resolveApiBase(apiBase);
      return new URL(maybeUrl, base).toString();
    } catch {
      return maybeUrl;
    }
  }
}

export function checkImageExists(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    try {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      // cache-bust to avoid stale 404 cached responses
      img.src = url + (url.includes("?") ? "&_ts=" : "?_ts=") + Date.now();
    } catch {
      resolve(false);
    }
  });
}

export async function resolveAvatar(userOrUrl, apiBase = "") {
  if (!userOrUrl) return null;
  if (typeof userOrUrl === "string") {
    const abs = toAbsoluteUrl(userOrUrl, apiBase);
    if (await checkImageExists(abs)) return abs;
    return null;
  }
  const candidates = [
    userOrUrl.avatarUrl,
    userOrUrl.avatar,
    userOrUrl.image,
    userOrUrl.photo,
    userOrUrl.picture,
    userOrUrl.profileImage,
  ].filter(Boolean);

  for (const c of candidates) {
    const abs = toAbsoluteUrl(c, apiBase);
    // eslint-disable-next-line no-await-in-loop
    if (await checkImageExists(abs)) return abs;
  }
  return null;
}

export function computeInitialsFromName(name = "") {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}