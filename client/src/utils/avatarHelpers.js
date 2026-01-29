// src/utils/avatarHelpers.js

/* Build-time env */
const ENV_BASE =
  typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE
    ? process.env.REACT_APP_API_BASE
    : "";

const BASE = (ENV_BASE || "").replace(/V$/, "");

export const avatarSize = 34;

/**
 * Resolve API base URL from multiple possible sources.
 * Returns a string (possibly empty) but never undefined.
 */
export function resolveApiBase(endpointProp) {
  if (endpointProp) {
    try {
      return new URL(endpointProp).toString();
    } catch {
      try {
        if (typeof window !== "undefined" && window.location && window.location.origin) {
          return new URL(endpointProp, window.location.origin).toString();
        }
        return endpointProp;
      } catch {
        return endpointProp;
      }
    }
  }

  if (BASE) {
    try {
      return BASE.replace(/V$/, "");
    } catch {
      return BASE;
    }
  }

  try {
    if (typeof window !== "undefined") {
      // runtime override if available
      // eslint-disable-next-line no-underscore-dangle
      const runtime = window._ENV_ || null;
      if (runtime && runtime.API_BASE) {
        return runtime.API_BASE.replace(/V$/, "");
      }
    }
  } catch {}

  try {
    if (typeof window !== "undefined" && window.location && window.location.origin) {
      return window.location.origin;
    }
  } catch {}

  return "";
}

/**
 * Compute up to two-character initials from a name string.
 * Returns "?" when name is missing or invalid.
 */
export function computeInitialsFromName(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    const p = parts[0];
    const first = (p[0] || "?").toUpperCase();
    const second = (p[1] || "").toUpperCase();
    return (first + second).slice(0, 2);
  }
  const first = (parts[0][0] || "").toUpperCase();
  const last = (parts[parts.length - 1][0] || "").toUpperCase();
  const combined = (first + last).slice(0, 2);
  return combined || "?";
}

/**
 * Check whether an image URL loads successfully in the browser.
 * Returns a Promise<boolean>. Safe for SSR: returns false when Image/window not available.
 */
export function checkImageExists(url) {
  return new Promise((resolve) => {
    if (!url || typeof url !== "string") return resolve(false);
    if (typeof window === "undefined" || typeof Image === "undefined") return resolve(false);
    try {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      const separator = url.includes("?") ? "&" : "?";
      // small cache-busting param
      img.src = `${url}${separator}_=${Date.now() % 10000}`;
    } catch {
      resolve(false);
    }
  });
}

/**
 * Convert a possibly-relative URL into an absolute URL using apiBaseProp or window.location.
 * Returns the original string as a fallback if URL construction fails.
 */
export function buildAbsoluteUrl(maybeUrl, apiBaseProp) {
  if (!maybeUrl) return null;
  try {
    // If absolute, this will succeed
    return new URL(maybeUrl).toString();
  } catch {
    try {
      const base = resolveApiBase(apiBaseProp) || (typeof window !== "undefined" ? window.location.origin : "");
      return new URL(maybeUrl, base).toString();
    } catch {
      // fallback to original string
      return maybeUrl;
    }
  }
}

/**
 * Resolve avatar for a user object.
 * Returns a string URL when a reachable image is found, otherwise null.
 * This function guarantees it never returns a boolean.
 */
export async function resolveAvatar(user, apiBaseProp) {
  if (!user || typeof user !== "object") return null;

  const candidates = [
    user.avatarUrl,
    user.avatar,
    user.image,
    user.photo,
    user.picture,
    user.profileImage,
  ].filter(Boolean);

  for (const c of candidates) {
    try {
      const abs = buildAbsoluteUrl(c, apiBaseProp);
      if (!abs) continue;
      // checkImageExists returns boolean; only return the string when true
      // eslint-disable-next-line no-await-in-loop
      const ok = await checkImageExists(abs);
      if (ok) return abs;
    } catch (err) {
      // ignore and continue to next candidate
      // console.debug("avatar candidate error", err);
    }
  }

  return null;
}