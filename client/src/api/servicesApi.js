// servicesApi.js
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export async function fetchServices() {
  const res = await fetch(`${API_BASE}/services`);
  if (!res.ok) {
    throw new Error('Failed to fetch services');
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