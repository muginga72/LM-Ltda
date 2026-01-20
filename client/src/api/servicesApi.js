// servicesApi.js
const API_BASE =
  (process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.replace(/\/$/, '')) ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : `${window.location.protocol}//${window.location.host}/api`);

export async function fetchServices(signal) {
  const url = `${API_BASE}/services`;
  const res = await fetch(url, { method: 'GET', signal, credentials: 'include' });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Failed to fetch services: ${res.status} ${res.statusText} - ${body}`);
  }
  return res.json();
}

export async function createService(payload, token, isFormData = false) {
  const res = await fetch(`${API_BASE}/services`, {
    method: 'POST',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: isFormData ? payload : JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create service');
  }
  return res.json();
}

export async function updateService(id, payload, token) {
  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update service');
  }
  return res.json();
}

export async function deleteService(id, token) {
  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete service');
  }
  return res.json();
}
