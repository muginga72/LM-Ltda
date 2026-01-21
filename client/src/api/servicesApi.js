// api/servicesApi.js
const stripTrailingSlash = (s) => (s ? s.replace(/\/+$/, '') : s);

let API_BASE = null;

// Use explicit env var if provided
if (process.env.REACT_APP_API_BASE) {
  API_BASE = stripTrailingSlash(process.env.REACT_APP_API_BASE);
} else if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  // Local development
  API_BASE = 'http://localhost:5000';
} else {
  // Production API host (explicit)
  API_BASE = 'https://lmltda-api.onrender.com';
}

// Helper to join base and path without duplicating slashes or segments
const buildUrl = (path) => {
  const cleanBase = stripTrailingSlash(API_BASE);
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}/${cleanPath}`;
};

async function parseResponse(res) {
  // Read text first to avoid json() throwing on empty body
  const text = await res.text().catch(() => '');
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function fetchServices(signal) {
  const url = buildUrl('/api/services');
  const res = await fetch(url, { method: 'GET', signal, credentials: 'include' });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Failed to fetch services: ${res.status} ${res.statusText} - ${body}`);
  }
  return parseResponse(res);
}

export async function createService(payload, token, isFormData = false) {
  const url = buildUrl('/api/services');
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: isFormData ? payload : JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await parseResponse(res).catch(() => ({}));
    throw new Error((err && err.error) || 'Failed to create service');
  }
  return parseResponse(res);
}

export async function updateService(id, payload, token) {
  const url = buildUrl(`/api/services/${id}`);
  const res = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await parseResponse(res).catch(() => ({}));
    throw new Error((err && err.error) || 'Failed to update service');
  }
  return parseResponse(res);
}

export async function deleteService(id, token) {
  const url = buildUrl(`/api/services/${id}`);
  const res = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const err = await parseResponse(res).catch(() => ({}));
    throw new Error((err && err.error) || 'Failed to delete service');
  }
  return parseResponse(res);
}