// client/src/services/fetchServices.js
const stripTrailingSlash = (s) => (s ? s.replace(/\/+$/, "") : s);

function resolveApiBase() {
  if (process.env.REACT_APP_API_BASE) {
    return stripTrailingSlash(process.env.REACT_APP_API_BASE);
  }

  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:5000";
  }

  // Production default (override by setting REACT_APP_API_BASE)
  return "https://lmltda-api.onrender.com";
}

const API_BASE = resolveApiBase();

const buildUrl = (path) => {
  const cleanBase = stripTrailingSlash(API_BASE);
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${cleanBase}/${cleanPath}`;
};

async function parseJsonSafe(response) {
  const text = await response.text().catch(() => "");
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const fetchServices = async (signal) => {
  const url = buildUrl("/api/services");

  let response;
  try {
    response = await fetch(url, {
      method: "GET",
      signal,
      credentials: "include", // include cookies if your API uses them
      headers: {
        "Accept": "application/json",
      },
    });
  } catch (err) {
    // Network-level error (DNS, connection refused, CORS preflight failure, aborted, etc.)
    if (err.name === "AbortError") throw err;
    throw new Error(`Network error while fetching services: ${err.message}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`API error fetching services: ${response.status} ${response.statusText} - ${body}`);
  }

  const data = await parseJsonSafe(response);

  // Accept either { services: [...] } or an array directly
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.services)) return data.services;

  throw new Error("Invalid API response format for services");
};

export default fetchServices;