// src/api/bookingsApi.js
const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function authHeader(role = 'user') {
  // Demo: replace with real token retrieval
  return { Authorization: role === 'admin' ? 'Bearer admin' : 'Bearer user' };
}

export async function checkAvailability(roomId, startDate, endDate) {
  const q = new URLSearchParams({ startDate, endDate });
  const res = await fetch(`${BASE}/api/bookings/${roomId}/availability?${q.toString()}`, {
    headers: { ...authHeader('user') },
  });
  return res.json();
}

export async function createBooking(formData) {
  const res = await axios.post("/api/bookings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function listMyBookings() {
  const res = await fetch(`${BASE}/bookings/my`, {
    headers: { ...authHeader('user') },
  });
  return res.json();
}

export async function getBooking(bookingId) {
  const res = await fetch(`${BASE}/api/bookings/${bookingId}`, {
    headers: { ...authHeader('user') },
  });
  return res.json();
}

export async function cancelBooking(bookingId) {
  const res = await fetch(`${BASE}/api/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: { ...authHeader('user') },
  });
  return res.json();
}

// Admin
export async function listPendingBookingsAdmin() {
  const res = await fetch(`${BASE}/api/bookings/admin/all`, {
    headers: { ...authHeader('admin') },
  });
  return res.json();
}

export async function confirmBookingAdmin(bookingId) {
  const res = await fetch(`${BASE}/api/bookings/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader('admin') },
    body: JSON.stringify({ bookingId }),
  });
  return res.json();
}