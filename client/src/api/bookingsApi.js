// // src/api/bookingsApi.js
// const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

// function getAuthHeader() {
//   // Prefer a real JWT stored in localStorage; fall back to demo token for local dev
//   const token = (typeof window !== 'undefined' && localStorage.getItem('token')) || null;
//   if (token && token !== 'undefined' && token !== 'null') {
//     return { Authorization: `Bearer ${token}` };
//   }
//   // Demo token (only for local development when backend accepts it)
//   return { Authorization: 'Bearer user' };
// }

// async function handleResponse(res) {
//   const text = await res.text();
//   let data;
//   try {
//     data = text ? JSON.parse(text) : {};
//   } catch {
//     data = { message: text || res.statusText };
//   }

//   if (!res.ok) {
//     const err = new Error(data.message || `Request failed (${res.status})`);
//     err.status = res.status;
//     err.body = data;
//     throw err;
//   }
//   return data;
// }

// // User endpoints
// export async function checkAvailability(roomId, startDate, endDate) {
//   const q = new URLSearchParams({ startDate, endDate });
//   const res = await fetch(`${BASE}/api/bookings/${encodeURIComponent(roomId)}/availability?${q.toString()}`, {
//     headers: { Accept: 'application/json', ...getAuthHeader() },
//   });
//   return handleResponse(res);
// }

// export async function createBooking(formData) {
//   // formData is a FormData instance (multipart/form-data)
//   const res = await fetch(`${BASE}/api/bookings`, {
//     method: 'POST',
//     // Do not set Content-Type for multipart; browser will set the boundary automatically
//     headers: { ...getAuthHeader() },
//     body: formData,
//   });
//   return handleResponse(res);
// }

// export async function listMyBookings() {
//   const res = await fetch(`${BASE}/api/bookings/my`, {
//     headers: { Accept: 'application/json', ...getAuthHeader() },
//   });
//   return handleResponse(res);
// }

// export async function getBooking(bookingId) {
//   const res = await fetch(`${BASE}/api/bookings/${encodeURIComponent(bookingId)}`, {
//     headers: { Accept: 'application/json', ...getAuthHeader() },
//   });
//   return handleResponse(res);
// }

// export async function cancelBooking(bookingId) {
//   const res = await fetch(`${BASE}/api/bookings/${encodeURIComponent(bookingId)}`, {
//     method: 'DELETE',
//     headers: { Accept: 'application/json', ...getAuthHeader() },
//   });
//   return handleResponse(res);
// }

// // Admin endpoints
// export async function listPendingBookingsAdmin() {
//   const res = await fetch(`${BASE}/api/bookings/admin/all`, {
//     headers: { Accept: 'application/json', ...getAuthHeader() },
//   });
//   return handleResponse(res);
// }

// export async function confirmBookingAdmin(bookingId) {
//   const res = await fetch(`${BASE}/api/bookings/confirm`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...getAuthHeader() },
//     body: JSON.stringify({ bookingId }),
//   });
//   return handleResponse(res);
// }


// src/api/bookingsApi.js
const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

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
  const res = await fetch(`${BASE}/api/bookings/`, {
    method: 'POST',
    headers: { ...authHeader('user') }, // do not set Content-Type for multipart
    body: formData,
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