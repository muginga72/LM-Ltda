// // src/api/roomApi.js
// const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

// function buildHeaders(token, isFormData = false) {
//   const headers = {};
//   if (!isFormData) headers["Content-Type"] = "application/json";
//   if (token) headers["Authorization"] = `Bearer ${token}`;
//   return headers;
// }

// async function handleResponse(res) {
//   if (res.ok) return res.json().catch(() => ({}));
//   // try to parse error body
//   const body = await res.json().catch(() => ({}));
//   const message = body.error || body.message || `Request failed (${res.status})`;
//   const err = new Error(message);
//   err.status = res.status;
//   throw err;
// }

// export async function fetchRooms(token = null, opts = { useCredentials: false }) {
//   const res = await fetch(`${API_BASE}/rooms`, {
//     method: "GET",
//     headers: buildHeaders(token, false),
//     credentials: opts.useCredentials ? "include" : "same-origin",
//   });
//   return handleResponse(res);
// }

// export async function createRoom(payload, token = null, isFormData = false, opts = { useCredentials: false }) {
//   const res = await fetch(`${API_BASE}/rooms`, {
//     method: "POST",
//     headers: buildHeaders(token, isFormData),
//     body: isFormData ? payload : JSON.stringify(payload),
//     credentials: opts.useCredentials ? "include" : "same-origin",
//   });
//   return handleResponse(res);
// }

// export async function updateRoom(id, payload, token = null, isFormData = false, opts = { useCredentials: false }) {
//   const res = await fetch(`${API_BASE}/rooms/${id}`, {
//     method: "PUT",
//     headers: buildHeaders(token, isFormData),
//     body: isFormData ? payload : JSON.stringify(payload),
//     credentials: opts.useCredentials ? "include" : "same-origin",
//   });
//   return handleResponse(res);
// }

// export async function deleteRoom(id, token = null, opts = { useCredentials: false }) {
//   const res = await fetch(`${API_BASE}/rooms/${id}`, {
//     method: "DELETE",
//     headers: buildHeaders(token, false),
//     credentials: opts.useCredentials ? "include" : "same-origin",
//   });
//   return handleResponse(res);
// }


// src/api/roomsApi.js
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

function buildHeaders(token, isFormData = false) {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res) {
  if (res.ok) {
    // try to parse JSON, but tolerate empty body
    return res.text().then((text) => {
      try {
        return text ? JSON.parse(text) : {};
      } catch {
        return {};
      }
    });
  }
  // try to parse error body
  const bodyText = await res.text().catch(() => "");
  let body = {};
  try {
    body = bodyText ? JSON.parse(bodyText) : {};
  } catch {
    body = {};
  }
  const message = body.error || body.message || `Request failed (${res.status})`;
  const err = new Error(message);
  err.status = res.status;
  throw err;
}

/**
 * GET /rooms
 * token: optional JWT
 * opts: { useCredentials: boolean }
 */
export async function fetchRooms(token = null, opts = { useCredentials: false }) {
  const res = await fetch(`${API_BASE}/rooms`, {
    method: "GET",
    headers: buildHeaders(token, false),
    credentials: opts.useCredentials ? "include" : "same-origin",
  });
  return handleResponse(res);
}

/**
 * POST /rooms
 * payload: either plain object (JSON) or FormData
 * token: optional JWT
 * isFormData: boolean - when true, payload is FormData
 * opts: { useCredentials: boolean, onProgress: function(percent) }
 *
 * When isFormData === true and onProgress provided, this function uses XHR to report upload progress.
 */
export function createRoom(payload, token = null, isFormData = false, opts = { useCredentials: false, onProgress: null }) {
  if (isFormData) {
    // Use XMLHttpRequest to support upload progress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `${API_BASE}/rooms`;
      xhr.open("POST", url, true);

      // Set headers (Authorization only; Content-Type is set automatically for FormData)
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.withCredentials = !!opts.useCredentials;

      xhr.upload.onprogress = function (ev) {
        if (!ev.lengthComputable) return;
        const percent = Math.round((ev.loaded * 100) / ev.total);
        if (typeof opts.onProgress === "function") opts.onProgress(percent);
      };

      xhr.onload = function () {
        const status = xhr.status;
        const text = xhr.responseText;
        let body = {};
        try {
          body = text ? JSON.parse(text) : {};
        } catch {
          body = {};
        }
        if (status >= 200 && status < 300) {
          resolve(body);
        } else {
          const message = body.error || body.message || `Request failed (${status})`;
          const err = new Error(message);
          err.status = status;
          reject(err);
        }
      };

      xhr.onerror = function () {
        reject(new Error("Network error"));
      };

      xhr.onabort = function () {
        reject(new Error("Upload aborted"));
      };

      xhr.send(payload);
    });
  } else {
    // JSON POST via fetch
    return fetch(`${API_BASE}/rooms`, {
      method: "POST",
      headers: buildHeaders(token, false),
      body: JSON.stringify(payload),
      credentials: opts.useCredentials ? "include" : "same-origin",
    }).then(handleResponse);
  }
}

/**
 * PUT /rooms/:id
 */
export async function updateRoom(id, payload, token = null, isFormData = false, opts = { useCredentials: false }) {
  if (isFormData) {
    // Use fetch for FormData (no progress)
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
      method: "PUT",
      headers: buildHeaders(token, true),
      body: payload,
      credentials: opts.useCredentials ? "include" : "same-origin",
    });
    return handleResponse(res);
  } else {
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
      method: "PUT",
      headers: buildHeaders(token, false),
      body: JSON.stringify(payload),
      credentials: opts.useCredentials ? "include" : "same-origin",
    });
    return handleResponse(res);
  }
}

/**
 * DELETE /rooms/:id
 */
export async function deleteRoom(id, token = null, opts = { useCredentials: false }) {
  const res = await fetch(`${API_BASE}/rooms/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token, false),
    credentials: opts.useCredentials ? "include" : "same-origin",
  });
  return handleResponse(res);
}