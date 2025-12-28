import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Spinner, Alert, Button, Form } from "react-bootstrap";

export default function BookingForm({
  room,
  user,
  token,
  apiBaseUrl = "",
  headers = {},
  onBooked,
  onShowPayInstructions,
  onCancel,
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(room?.roomCapacity ?? room?.capacity ?? 1);

  // Personal / ID fields
  const [guestOneName, setGuestOneName] = useState(user?.name ?? "");
  const [guestOneEmail, setGuestOneEmail] = useState(user?.email ?? "");
  const [guestTwoName, setGuestTwoName] = useState("");
  const [guestTwoEmail, setGuestTwoEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [notes, setNotes] = useState("");
  const [idFile, setIdFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // amount state (optional override)
  const [amount, setAmount] = useState(room?.price ?? 0);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const authToken = useMemo(() => token || user?.token || localStorage.getItem("authToken") || null, [
    token,
    user?.token,
  ]);

  const defaultHeaders = useMemo(
    () => ({
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      "Cache-Control": "no-cache",
      ...headers,
    }),
    [authToken, headers]
  );

  const buildUrl = (path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    if (!apiBaseUrl) return normalizedPath;
    const base = apiBaseUrl.replace(/\/+$/, "");
    return `${base}${normalizedPath}`;
  };

  useEffect(() => {
    // clear messages when inputs change
    setError(null);
    setSuccessMsg(null);
  }, [startDate, endDate, guests, dateOfBirth, idFile, guestOneName, guestOneEmail]);

  const computeNights = (s, e) => {
    if (!s || !e) return 1;
    const msPerDay = 24 * 60 * 60 * 1000;
    const diff = Math.ceil((e - s) / msPerDay);
    return diff > 0 ? diff : 1;
  };

  const computeTotalPrice = (nights) => {
    const perNight = Number(room?.pricePerNight?.amount ?? room?.pricePerNight ?? room?.price ?? 0) || 0;
    const amountCalc = Math.max(0, perNight * nights);
    const currency = room?.pricePerNight?.currency ?? room?.currency ?? "USD";
    return { amount: amountCalc, currency };
  };

  const validate = () => {
    setError(null);

    const roomId = room?._id ?? room?.id;
    if (!roomId) {
      setError("No room selected.");
      return false;
    }
    if (!user || !(user._id || user.id)) {
      setError("No user available. Please sign in.");
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
    if (s >= e) {
      setError("End date must be after start date.");
      return false;
    }
    if (!Number.isInteger(Number(guests)) || Number(guests) < 1) {
      setError("Guests must be a positive integer.");
      return false;
    }
    if (!guestOneName || guestOneName.trim() === "") {
      setError("Primary guest name is required.");
      return false;
    }
    if (!dateOfBirth) {
      setError("Date of birth is required.");
      return false;
    }
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      setError("Invalid date of birth.");
      return false;
    }
    // basic age check (server also enforces >=18)
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const birthdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (today < birthdayThisYear) age--;
    if (age < 18) {
      setError("Guest must be at least 18 years old to book.");
      return false;
    }
    if (!idFile) {
      setError("Government ID / passport upload (idDocument) is required.");
      return false;
    }
    // file size check (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (idFile.size > maxSize) {
      setError("ID file is too large. Maximum 10MB allowed.");
      return false;
    }
    // basic email validation if provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (guestOneEmail && !emailRegex.test(guestOneEmail)) {
      setError("Primary guest email is invalid.");
      return false;
    }
    if (guestTwoEmail && !emailRegex.test(guestTwoEmail)) {
      setError("Secondary guest email is invalid.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files?.[0] || null;
    setIdFile(file);
  };

  const handleShowBankInfo = (createdBooking, totalAmount) => {
    const bankInfo = {
      accountName: "Maria Miguel",
      accountNumber: "342295560 30 001",
      routingNumber: "AO06 0006 0000 42295560301 25",
      bankName: "BFA",
      reference: `BOOK-${room?.id ?? room?._id ?? "unknown"}`,
      amount: totalAmount,
      currency: "USD",
      booking: createdBooking,
    };
    if (typeof onShowPayInstructions === "function") {
      onShowPayInstructions(bankInfo);
    }
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError(null);
    setSuccessMsg(null);
    if (!validate()) return;

    setLoading(true);
    setProgress(0);
    try {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const nights = computeNights(s, e);
      const totalPrice = computeTotalPrice(nights);

      // Build form data
      const formData = new FormData();
      formData.append("room", room?._id ?? room?.id ?? "");
      formData.append("roomId", room?._id ?? room?.id ?? "");
      formData.append("guest", user?._id ?? user?.id ?? "");
      if (room?.host) formData.append("host", room.host._id ?? room.host);
      formData.append("startDate", s.toISOString());
      formData.append("endDate", e.toISOString());
      formData.append("nights", String(nights));
      formData.append("guestsCount", String(guests));
      formData.append("dateOfBirth", new Date(dateOfBirth).toISOString());
      formData.append("guestOneName", guestOneName);
      if (guestOneEmail) formData.append("guestOneEmail", guestOneEmail);
      if (guestTwoName) formData.append("guestTwoName", guestTwoName);
      if (guestTwoEmail) formData.append("guestTwoEmail", guestTwoEmail);
      if (guestPhone) formData.append("guestOnePhone", guestPhone);
      if (notes) formData.append("notes", notes);
      formData.append("totalPrice[amount]", String(totalPrice.amount));
      formData.append("totalPrice[currency]", totalPrice.currency);
      formData.append("idDocument", idFile, idFile.name);

      const candidates = ["/api/bookings", "/bookings"];
      let created = null;
      let lastErr = null;

      for (const path of candidates) {
        try {
          const url = buildUrl(path);
          const cfg = {
            headers: { ...defaultHeaders },
            onUploadProgress: (progressEvent) => {
              try {
                if (progressEvent.lengthComputable && progressEvent.total) {
                  const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                  setProgress(percent);
                }
              } catch (e) {
                // ignore progress errors
              }
            },
            timeout: 120000,
          };

          const res = await axios.post(url, formData, cfg);
          created = res?.data;
          break;
        } catch (err) {
          lastErr = err;
          const status = err?.response?.status;
          if (status === 404) continue;
          throw err;
        }
      }

      if (!created) {
        const msg =
          lastErr?.response?.data?.message ||
          lastErr?.response?.data?.error ||
          lastErr?.message ||
          "No bookings endpoint accepted the request (404).";
        throw new Error(msg);
      }

      setSuccessMsg("Booking created successfully.");
      setProgress(null);
      onBooked && onBooked(created);

      // If payment method is bank transfer, show bank info via callback
      if (paymentMethod === "bank") {
        handleShowBankInfo(created, totalPrice.amount);
      }
    } catch (err) {
      console.error("Booking create error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create booking. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  return (
    <Form onSubmit={handleSubmit} encType="multipart/form-data">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMsg && (
        <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}

      <Form.Group className="mb-2">
        <Form.Label>Start date</Form.Label>
        <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>End date</Form.Label>
        <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Guests</Form.Label>
        <Form.Control type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
      </Form.Group>

      <hr />

      <Form.Group className="mb-3">
        <Form.Label>Primary guest name</Form.Label>
        <Form.Control type="text" value={guestOneName} onChange={(e) => setGuestOneName(e.target.value)} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Primary guest email</Form.Label>
        <Form.Control type="email" value={guestOneEmail} onChange={(e) => setGuestOneEmail(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Secondary guest name (optional)</Form.Label>
        <Form.Control type="text" value={guestTwoName} onChange={(e) => setGuestTwoName(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Secondary guest email (optional)</Form.Label>
        <Form.Control type="email" value={guestTwoEmail} onChange={(e) => setGuestTwoEmail(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Primary guest phone</Form.Label>
        <Form.Control type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Date of birth</Form.Label>
        <Form.Control type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Payment method</Form.Label>
        <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="card">Bank deposit</option>
          <option value="bank">Bank transfer</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Notes (optional)</Form.Label>
        <Form.Control as="textarea" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>ID Document / Passport (required)</Form.Label>
        <Form.Control type="file" accept=".pdf,image/*" onChange={handleFileChange} required />
        <Form.Text className="text-muted">Max 10MB. PDF or image formats accepted.</Form.Text>
      </Form.Group>

      {progress !== null && (
        <div className="mb-2">
          <div className="progress" style={{ height: 18 }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress}%
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Book room"}
        </Button>
      </div>
    </Form>
  );
}

BookingForm.propTypes = {
  room: PropTypes.object,
  user: PropTypes.object,
  token: PropTypes.string,
  apiBaseUrl: PropTypes.string,
  headers: PropTypes.object,
  onBooked: PropTypes.func,
  onShowPayInstructions: PropTypes.func,
  onCancel: PropTypes.func,
};

BookingForm.defaultProps = {
  room: null,
  user: null,
  token: null,
  apiBaseUrl: "",
  headers: {},
  onBooked: null,
  onShowPayInstructions: null,
  onCancel: () => {},
};
