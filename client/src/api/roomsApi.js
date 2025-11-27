// src/api/roomApi.js
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

function buildHeaders(token, isFormData = false) {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res) {
  if (res.ok) return res.json().catch(() => ({}));
  // try to parse error body
  const body = await res.json().catch(() => ({}));
  const message = body.error || body.message || `Request failed (${res.status})`;
  const err = new Error(message);
  err.status = res.status;
  throw err;
}

export async function fetchRooms(token = null, opts = { useCredentials: false }) {
  const res = await fetch(`${API_BASE}/rooms`, {
    method: "GET",
    headers: buildHeaders(token, false),
    credentials: opts.useCredentials ? "include" : "same-origin",
  });
  return handleResponse(res);
}

export async function createRoom(payload, token = null, isFormData = false, opts = { useCredentials: false }) {
  const res = await fetch(`${API_BASE}/rooms`, {
    method: "POST",
    headers: buildHeaders(token, isFormData),
    body: isFormData ? payload : JSON.stringify(payload),
    credentials: opts.useCredentials ? "include" : "same-origin",
  });
  return handleResponse(res);
}

export async function updateRoom(id, payload, token = null, isFormData = false, opts = { useCredentials: false }) {
  const res = await fetch(`${API_BASE}/rooms/${id}`, {
    method: "PUT",
    headers: buildHeaders(token, isFormData),
    body: isFormData ? payload : JSON.stringify(payload),
    credentials: opts.useCredentials ? "include" : "same-origin",
  });
  return handleResponse(res);
}

export async function deleteRoom(id, token = null, opts = { useCredentials: false }) {
  const res = await fetch(`${API_BASE}/rooms/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token, false),
    credentials: opts.useCredentials ? "include" : "same-origin",
  });
  return handleResponse(res);
}