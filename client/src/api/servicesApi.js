// src/api/servicesApi.js
const getRawBase = () => {
  const env = typeof process !== 'undefined' ? process.env.REACT_APP_API_BASE : undefined;
  if (env && env.trim()) return env.replace(/\/+$/, '');
  if (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return 'http://localhost:5000';
};

const RAW_BASE = getRawBase();

function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // If RAW_BASE already ends with /api, don't add another /api
  if (/\/api$/i.test(RAW_BASE)) {
    return `${RAW_BASE}${normalizedPath}`;
  }
  return `${RAW_BASE}/api${normalizedPath}`;
}

async function parseResponseBody(res) {
  const text = await res.text().catch(() => '');
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

async function doFetch(url, opts = {}) {
  let res;
  try {
    res = await fetch(url, opts);
  } catch (networkErr) {
    const e = new Error(`Network error: ${networkErr.message || networkErr}`);
    e.cause = networkErr;
    throw e;
  }

  if (res.status === 304) {
    // No body returned for 304; caller should handle this case if needed.
    return { status: 304, body: null };
  }

  if (!res.ok) {
    const body = await parseResponseBody(res).catch(() => null);
    const msg = body && (body.message || body.error) ? `${body.message || body.error}` : `${res.status} ${res.statusText}`;
    const err = new Error(`Request failed: ${msg}`);
    err.status = res.status;
    err.response = body;
    throw err;
  }

  const body = await parseResponseBody(res).catch(() => null);
  return { status: res.status, body };
}

// Public API functions
export async function fetchServices(signal = undefined, useCredentials = true) {
  const url = buildApiUrl('/api/services');
  const opts = {
    method: 'GET',
    signal,
    credentials: useCredentials ? 'include' : 'omit',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  };

  const { status, body } = await doFetch(url, opts);
  // If 304 returned, return empty array to avoid breaking callers; prefer fresh fetch by using no-cache header.
  if (status === 304) return [];
  // API may return an array or an object { services: [...] }
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.services)) return body.services;
  return [];
}

export async function createService(payload, token = null, isFormData = false, useCredentials = false) {
  const url = buildApiUrl('/api/services');
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const opts = {
    method: 'POST',
    headers,
    body: isFormData ? payload : JSON.stringify(payload),
    credentials: useCredentials ? 'include' : 'omit',
  };

  const { body } = await doFetch(url, opts);
  return body;
}

export async function updateService(id, payload, token = null, useCredentials = false) {
  if (!id) throw new Error('updateService: id is required');
  const url = buildApiUrl(`/api/services/${encodeURIComponent(id)}`);
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const opts = {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
    credentials: useCredentials ? 'include' : 'omit',
  };

  const { body } = await doFetch(url, opts);
  return body;
}

export async function deleteService(id, token = null, useCredentials = false) {
  if (!id) throw new Error('deleteService: id is required');
  const url = buildApiUrl(`/api/services/${encodeURIComponent(id)}`);
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const opts = {
    method: 'DELETE',
    headers,
    credentials: useCredentials ? 'include' : 'omit',
  };

  const { body } = await doFetch(url, opts);
  return body;
}

export default {
  fetchServices,
  createService,
  updateService,
  deleteService,
};