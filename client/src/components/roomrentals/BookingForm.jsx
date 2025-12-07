// // src/components/roomrentals/BookingForm.jsx
// import React, { useState, useContext } from "react";
// import PropTypes from "prop-types";
// import { Form, Button, Alert, Spinner } from "react-bootstrap";
// import axios from "axios";
// import { AuthContext } from "../../context/AuthContext"; 

// export default function BookingForm({ room, onSuccess, onClose }) {
//   const { user } = useContext(AuthContext);
//   const token = user?.token; 

//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [dateOfBirth, setDateOfBirth] = useState("");
//   const [guestsCount, setGuestsCount] = useState(room?.roomCapacity || 1);
//   const [idFile, setIdFile] = useState(null);
//   const [status, setStatus] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!startDate || !endDate || !dateOfBirth || !idFile) {
//       setStatus({
//         variant: "danger",
//         text: "Please fill all fields and upload ID/passport.",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const fd = new FormData();
//       fd.append("roomId", room._id || room.id);
//       fd.append("startDate", startDate);
//       fd.append("endDate", endDate);
//       fd.append("dateOfBirth", dateOfBirth);
//       fd.append("guestsCount", Number(guestsCount));
//       fd.append("idDocument", idFile);

//       const res = await axios.post("/api/bookings", fd, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//       });

//       setStatus({ variant: "success", text: "Booking created successfully." });
//       onSuccess && onSuccess(res.data);
//     } catch (err) {
//       setStatus({
//         variant: "danger",
//         text: err.response?.data?.message || "Booking failed.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       {status && <Alert variant={status.variant}>{status.text}</Alert>}

//       <Form.Group className="mb-2">
//         <Form.Label>Start date</Form.Label>
//         <Form.Control
//           type="date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           required
//         />
//       </Form.Group>

//       <Form.Group className="mb-2">
//         <Form.Label>End date</Form.Label>
//         <Form.Control
//           type="date"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           required
//         />
//       </Form.Group>

//       <Form.Group className="mb-2">
//         <Form.Label>Date of birth</Form.Label>
//         <Form.Control
//           type="date"
//           value={dateOfBirth}
//           onChange={(e) => setDateOfBirth(e.target.value)}
//           required
//         />
//       </Form.Group>

//       <Form.Group className="mb-2">
//         <Form.Label>Guests</Form.Label>
//         <Form.Control
//           type="number"
//           min="1"
//           value={guestsCount}
//           onChange={(e) => setGuestsCount(e.target.value)}
//           required
//         />
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>Upload ID / Passport</Form.Label>
//         <Form.Control
//           type="file"
//           name="idDocument"
//           accept="image/*,application/pdf"
//           onChange={(e) => setIdFile(e.target.files[0])}
//           // required
//         />
//       </Form.Group>

//       <div className="d-flex gap-2">
//         <Button type="submit" variant="primary" disabled={loading}>
//           {loading ? <Spinner animation="border" size="sm" /> : "Book Now"}
//         </Button>
//         <Button variant="secondary" onClick={onClose} disabled={loading}>
//           Cancel
//         </Button>
//       </div>
//     </Form>
//   );
// }

// BookingForm.propTypes = {
//   room: PropTypes.object.isRequired,
//   onSuccess: PropTypes.func,
//   onClose: PropTypes.func,
// };

// BookingForm.defaultProps = {
//   onSuccess: undefined,
//   onClose: undefined,
// };

import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

export default function BookingForm({ show, onHide, room, token, apiBaseUrl }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [idDocument, setIdDocument] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!idDocument) return setError("Please upload an ID document.");
    if (!startDate || !endDate || !dateOfBirth) return setError("All fields are required.");

    const formData = new FormData();
    formData.append("roomId", room._id || room.id);
    formData.append("startDate", new Date(startDate).toISOString());
    formData.append("endDate", new Date(endDate).toISOString());
    formData.append("dateOfBirth", new Date(dateOfBirth).toISOString());
    formData.append("guestsCount", guestsCount);
    formData.append("idDocument", idDocument);

    try {
      setLoading(true);
      const res = await axios.post(`${apiBaseUrl}/api/bookings`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Booking successful!");
      onHide();
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Book {room?.name || "Room"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Guests</Form.Label>
            <Form.Control type="number" min="1" value={guestsCount} onChange={(e) => setGuestsCount(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>ID Document</Form.Label>
            <Form.Control type="file" accept="image/*,application/pdf" onChange={(e) => setIdDocument(e.target.files[0])} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Book Now"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}