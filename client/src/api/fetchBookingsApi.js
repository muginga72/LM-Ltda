// src/api/fetchBookingsApi.js
import axios from 'axios';

const candidatePaths = [
  '/admin/bookings',
  '/api/admin/bookings',
  '/bookings',
  '/api/bookings',
];

function buildAbsoluteUrl(base, pathWithQs) {
  const normalizedPath = pathWithQs.startsWith('/') ? pathWithQs : `/${pathWithQs}`;
  if (base && base.trim() !== '') {
    const baseClean = base.replace(/\/+$/, '');
    return `${baseClean}${normalizedPath}`;
  }
  const origin = (typeof window !== 'undefined' && window.location && window.location.origin) || '';
  return `${origin}${normalizedPath}`;
}

export async function fetchBookingsApi({
  apiBaseUrl = '',
  token = null,
  useCookies = false,
  tab = 'all',
  page = 1,
  timeout = 120000,
} = {}) {
  const qs = `?tab=${encodeURIComponent(tab)}&page=${encodeURIComponent(page)}`;
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Cache-Control': 'no-cache',
  };
  const axiosConfig = {
    headers,
    timeout,
    withCredentials: !!useCookies,
  };

  let lastError = null;

  for (const p of candidatePaths) {
    const fullPath = `${p}${qs}`;
    const url = buildAbsoluteUrl(apiBaseUrl, fullPath);
    try {
      const res = await axios.get(url, axiosConfig);
      // Expect server to return { page, limit, total, pages, bookings }
      return res.data || {};
    } catch (err) {
      lastError = err;
      const status = err?.response?.status;
      if (status === 404) {
        continue;
      }
      if (status === 401 || status === 403) {
        break;
      }
      continue;
    }
  }
  const status = lastError?.response?.status;
  const responseData = lastError?.response?.data || null;
  const message =
    responseData?.message ||
    responseData?.error ||
    lastError?.message ||
    'Failed to fetch bookings from any candidate endpoint';

  const err = new Error(message);
  err.status = status || 0;
  err.responseData = responseData;
  throw err;
}