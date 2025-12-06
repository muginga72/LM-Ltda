// // src/api/bookingsApi.js
// const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

// function authHeader(role = 'user') {
//   // Demo: replace with real token retrieval
//   return { Authorization: role === 'admin' ? 'Bearer admin' : 'Bearer user' };
// }

// export async function checkAvailability(roomId, startDate, endDate) {
//   const q = new URLSearchParams({ startDate, endDate });
//   const res = await fetch(`${BASE}/api/bookings/${roomId}/availability?${q.toString()}`, {
//     headers: { ...authHeader('user') },
//   });
//   return res.json();
// }

// export async function createBooking(formData) {
//   const res = await fetch(`${BASE}/api/bookings/`, {
//     method: 'POST',
//     headers: { ...authHeader('user') }, // do not set Content-Type for multipart
//     body: formData,
//   });
//   return res.json();
// }

// export async function listMyBookings() {
//   const res = await fetch(`${BASE}/bookings/my`, {
//     headers: { ...authHeader('user') },
//   });
//   return res.json();
// }

// export async function getBooking(bookingId) {
//   const res = await fetch(`${BASE}/api/bookings/${bookingId}`, {
//     headers: { ...authHeader('user') },
//   });
//   return res.json();
// }

// export async function cancelBooking(bookingId) {
//   const res = await fetch(`${BASE}/api/bookings/${bookingId}`, {
//     method: 'DELETE',
//     headers: { ...authHeader('user') },
//   });
//   return res.json();
// }

// // Admin
// export async function listPendingBookingsAdmin() {
//   const res = await fetch(`${BASE}/api/bookings/admin/all`, {
//     headers: { ...authHeader('admin') },
//   });
//   return res.json();
// }

// export async function confirmBookingAdmin(bookingId) {
//   const res = await fetch(`${BASE}/api/bookings/confirm`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', ...authHeader('admin') },
//     body: JSON.stringify({ bookingId }),
//   });
//   return res.json();
// }

// // src/api/bookingsApi.js
// const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

// function authHeader(role = 'user') {
//   // Demo: replace with real token retrieval
//   return { Authorization: role === 'admin' ? 'Bearer admin' : 'Bearer user' };
// }

// // User endpoints
// export async function checkAvailability(roomId, startDate, endDate) {
//   const q = new URLSearchParams({ startDate, endDate });
//   const res = await fetch(`${BASE}/bookings/${roomId}/availability?${q.toString()}`, {
//     headers: { ...authHeader('user') },
//   });
//   return res.json();
// }

// export async function createBooking(formData) {
//   const res = await fetch(`${BASE}/bookings`, {
//     method: 'POST',
//     headers: { ...authHeader('user') }, // do not set Content-Type for multipart
//     body: formData,
//   });
//   return res.json();
// }

// export async function listMyBookings() {
//   const res = await fetch(`${BASE}/bookings/my`, {
//     headers: { ...authHeader('user') },
//   });
//   return res.json();
// }

// export async function getBooking(bookingId) {
//   const res = await fetch(`${BASE}/bookings/${bookingId}`, {
//     headers: { ...authHeader('user') },
//   });
//   return res.json();
// }

// export async function cancelBooking(bookingId) {
//   const res = await fetch(`${BASE}/bookings/${bookingId}`, {
//     method: 'DELETE',
//     headers: { ...authHeader('user') },
//   });
//   return res.json();
// }

// // Admin endpoints
// export async function listPendingBookingsAdmin() {
//   const res = await fetch(`${BASE}/bookings/admin/all`, {
//     headers: { ...authHeader('admin') },
//   });
//   return res.json();
// }

// export async function confirmBookingAdmin(bookingId) {
//   const res = await fetch(`${BASE}/bookings/confirm`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', ...authHeader('admin') },
//     body: JSON.stringify({ bookingId }),
//   });
//   return res.json();
// }