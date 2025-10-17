const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export async function fetchServices() {
  const res = await fetch(`${API_BASE}/services`);
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}

export async function createService(payload, token) {
  const res = await fetch(`${API_BASE}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const body = await res.json().catch(()=>({}));
    throw new Error(body.error || 'Failed to create service');
  }
  return res.json();
}