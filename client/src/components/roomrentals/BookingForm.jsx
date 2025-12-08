// // BookingForm.jsx
// import React, { useState, useEffect } from "react";
// import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";

// /**
//  * Props:
//  * - show: boolean
//  * - onHide: function
//  * - room: object { _id or id, name }
//  * - userId: string (required)
//  * - apiBaseUrl: optional base URL (e.g., "http://localhost:8800")
//  */
// export default function BookingForm({ show, onHide, room = {}, userId = "", apiBaseUrl = "" }) {
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [idDocument, setIdDocument] = useState(null); // file or null
//   const [guestsCount, setGuestsCount] = useState(1);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!show) {
//       // reset when modal closes
//       setStartDate("");
//       setEndDate("");
//       setIdDocument(null);
//       setGuestsCount(1);
//       setError("");
//       setLoading(false);
//     }
//   }, [show]);

//   const validate = () => {
//     setError("");
//     const roomId = room?._id || room?.id;
//     if (!roomId) {
//       setError("No room selected.");
//       return false;
//     }
//     if (!userId) {
//       setError("No userId provided.");
//       return false;
//     }
//     if (!startDate || !endDate) {
//       setError("Start and end dates are required.");
//       return false;
//     }
//     const s = new Date(startDate);
//     const e = new Date(endDate);
//     if (isNaN(s.getTime()) || isNaN(e.getTime())) {
//       setError("Invalid dates.");
//       return false;
//     }
//     if (s > e) {
//       setError("Start date must be before or equal to end date.");
//       return false;
//     }
//     if (!Number.isInteger(Number(guestsCount)) || Number(guestsCount) < 1) {
//       setError("Guests must be a positive integer.");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!validate()) return;

//     const roomId = room._id || room.id;
//     const base = apiBaseUrl ? apiBaseUrl.replace(/\/$/, "") : "";
//     const url = base ? `${base}/api/bookings` : "/api/bookings";

//     try {
//       setLoading(true);

//       // If a file is selected, send multipart/form-data using FormData
//       if (idDocument) {
//         const formData = new FormData();
//         formData.append("roomId", roomId);
//         formData.append("userId", userId);
//         // send raw date strings (server may expect YYYY-MM-DD) — adjust if server expects ISO
//         formData.append("startDate", startDate);
//         formData.append("endDate", endDate);
//         formData.append("guestsCount", String(guestsCount));
//         formData.append("idDocument", idDocument); // field name must match server expectation

//         // Do NOT set Content-Type header; browser will set boundary
//         const res = await fetch(url, {
//           method: "POST",
//           body: formData,
//         });

//         if (!res.ok) {
//           const body = await safeParseJson(res);
//           throw { status: res.status, body };
//         }

//         // success
//         onHide();
//         return;
//       }

//       // No file: send JSON
//       const jsonBody = { roomId, userId, startDate, endDate, guestsCount: Number(guestsCount) };
//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(jsonBody),
//       });

//       if (!res.ok) {
//         const body = await safeParseJson(res);
//         throw { status: res.status, body };
//       }

//       onHide();
//     } catch (err) {
//       console.error("Booking error:", err);
//       // err may be thrown object with status/body or a normal Error
//       if (err?.body) {
//         // try to extract message
//         const body = err.body;
//         if (typeof body === "string") setError(body);
//         else if (body?.message) setError(body.message);
//         else setError(JSON.stringify(body));
//       } else {
//         setError(err.message || "Booking failed.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // helper to parse JSON safely
//   async function safeParseJson(response) {
//     try {
//       return await response.json();
//     } catch {
//       try {
//         return await response.text();
//       } catch {
//         return null;
//       }
//     }
//   }

//   return (
//     <Modal show={show} onHide={() => { if (!loading) onHide(); }}>
//       <Form onSubmit={handleSubmit}>
//         <Modal.Header closeButton>
//           <Modal.Title>Book {room?.name || "Room"}</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           {error && <Alert variant="danger">{error}</Alert>}

//           <Form.Group className="mb-3" controlId="startDate">
//             <Form.Label>Start Date</Form.Label>
//             <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required disabled={loading} />
//           </Form.Group>

//           <Form.Group className="mb-3" controlId="endDate">
//             <Form.Label>End Date</Form.Label>
//             <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required disabled={loading} />
//           </Form.Group>

//           <Form.Group className="mb-3" controlId="guestsCount">
//             <Form.Label>Guests</Form.Label>
//             <Form.Control type="number" min="1" value={guestsCount} onChange={(e) => setGuestsCount(e.target.value)} disabled={loading} />
//           </Form.Group>

//           <Form.Group className="mb-3" controlId="idDocument">
//             <Form.Label>ID Document (optional)</Form.Label>
//             <Form.Control type="file" accept="image/*,application/pdf" onChange={(e) => setIdDocument(e.target.files?.[0] || null)} disabled={loading} />
//             {idDocument && <div className="mt-2"><small>Selected: <strong>{idDocument.name}</strong></small></div>}
//           </Form.Group>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => { if (!loading) onHide(); }} disabled={loading}>Cancel</Button>
//           <Button type="submit" variant="primary" disabled={loading}>
//             {loading ? <Spinner animation="border" size="sm" /> : "Book Now"}
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// }


// BookingForm.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";

/**
 * BookingForm
 *
 * Props:
 * - show: boolean
 * - onHide: function
 * - room: object { _id or id, name }
 * - userId: string (required)
 * - apiBaseUrl: optional base URL (e.g., "http://localhost:5000")
 */
export default function BookingForm({ show, onHide, room = null, userId = "", apiBaseUrl = "" }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) {
      // reset when modal closes
      setStartDate("");
      setEndDate("");
      setGuestsCount(1);
      setSelectedFile(null);
      setError("");
      setLoading(false);
    }
  }, [show]);

  function validateInputs() {
    setError("");
    const roomId = room?._id || room?.id;
    if (!roomId) {
      setError("No room selected. Please choose a room before booking.");
      return false;
    }
    if (!userId) {
      setError("No userId available. You must be signed in to book.");
      return false;
    }
    if (!startDate || !endDate) {
      setError("Start date and end date are required.");
      return false;
    }
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      setError("Invalid date format.");
      return false;
    }
    if (s > e) {
      setError("Start date must be before or equal to end date.");
      return false;
    }
    if (!Number.isInteger(Number(guestsCount)) || Number(guestsCount) < 1) {
      setError("Guests must be a positive integer.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!validateInputs()) return;

    const roomId = room._id || room.id;
    const base = apiBaseUrl ? apiBaseUrl.replace(/\/$/, "") : "";
    const url = base ? `${base}/api/bookings` : "/api/bookings";

    try {
      setLoading(true);

      // If a file is selected, send multipart/form-data
      if (selectedFile) {
        const formData = new FormData();
        formData.append("roomId", roomId);
        formData.append("userId", userId);
        // send raw date strings (server accepts YYYY-MM-DD or ISO depending on implementation)
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("guestsCount", String(guestsCount));
        formData.append("idDocument", selectedFile); // server expects 'idDocument'

        // Do NOT set Content-Type header manually; browser will set boundary
        const res = await fetch(url, {
          method: "POST",
          body: formData,
        });

        const textOrJson = await parseResponse(res);
        if (!res.ok) {
          // show server message if present
          const msg = extractMessage(textOrJson) || `Server responded with ${res.status}`;
          throw new Error(msg);
        }

        // success
        onHide();
        return;
      }

      // No file: send JSON
      const payload = {
        roomId,
        userId,
        startDate,
        endDate,
        guestsCount: Number(guestsCount),
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const textOrJson = await parseResponse(res);
      if (!res.ok) {
        const msg = extractMessage(textOrJson) || `Server responded with ${res.status}`;
        throw new Error(msg);
      }

      onHide();
    } catch (err) {
      console.error("Booking failed:", err);
      setError(err.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  }

  // Helper to parse response safely
  async function parseResponse(res) {
    try {
      return await res.json();
    } catch {
      try {
        return await res.text();
      } catch {
        return null;
      }
    }
  }

  // Helper to extract a friendly message from server response
  function extractMessage(body) {
    if (!body) return null;
    if (typeof body === "string") return body;
    if (body.message) return body.message;
    if (body.error) return body.error;
    // if body contains nested errors, join them
    if (body.errors) {
      if (Array.isArray(body.errors)) return body.errors.map((e) => e.msg || e).join("; ");
      if (typeof body.errors === "object") return Object.values(body.errors).join("; ");
    }
    return JSON.stringify(body);
  }

  return (
    <Modal show={show} onHide={() => { if (!loading) onHide(); }}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Book {room?.name || "Room"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3" controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="guestsCount">
            <Form.Label>Guests</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={guestsCount}
              onChange={(e) => setGuestsCount(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="idDocument">
            <Form.Label>ID Document (optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
            {selectedFile && (
              <div className="mt-2">
                <small>Selected file: <strong>{selectedFile.name}</strong></small>
              </div>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => { if (!loading) onHide(); }} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Book Now"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}