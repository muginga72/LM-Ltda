import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";

const BookRoomModal = ({ show, onHide, onSuccess, onError }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Availability state
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  // Submission / payment state
  const [submitting, setSubmitting] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // For debounce and cancellation
  const availabilityTimer = useRef(null);
  const availabilityController = useRef(null);

  useEffect(() => {
    if (!show) return;

    let mounted = true;
    setLoadingRooms(true);
    setError("");
    fetch("/api/rooms")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch rooms");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setRooms(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.message || "Failed to load rooms");
        setRooms([]);
      })
      .finally(() => {
        if (mounted) setLoadingRooms(false);
      });

    return () => {
      mounted = false;
    };
  }, [show]);

  useEffect(() => {
    if (!show) {
      setSelectedRoom("");
      setDateTime("");
      setIsAvailable(null);
      setAvailabilityMessage("");
      setError("");
      setSuccessMsg("");
    }
  }, [show]);

  // Debounced availability check
  useEffect(() => {
    if (availabilityTimer.current) {
      clearTimeout(availabilityTimer.current);
      availabilityTimer.current = null;
    }
    if (availabilityController.current) {
      availabilityController.current.abort();
      availabilityController.current = null;
    }

    setIsAvailable(null);
    setAvailabilityMessage("");

    if (!selectedRoom || !dateTime) return;

    const dt = new Date(dateTime);
    if (Number.isNaN(dt.getTime())) {
      setIsAvailable(false);
      setAvailabilityMessage("Invalid date/time");
      return;
    }

    setCheckingAvailability(true);
    availabilityTimer.current = setTimeout(() => {
      const controller = new AbortController();
      availabilityController.current = controller;

      const q = new URLSearchParams({ datetime: dateTime }).toString();
      fetch(`/api/rooms/${encodeURIComponent(selectedRoom)}/availability?${q}`, {
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((body) => {
              throw new Error(body?.message || "Unavailable");
            });
          }
          return res.json();
        })
        .then((body) => {
          const avail = Boolean(body?.available);
          setIsAvailable(avail);
          setAvailabilityMessage(body?.message || (avail ? "Available" : "Unavailable"));
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setIsAvailable(false);
          setAvailabilityMessage(err.message || "Unavailable");
        })
        .finally(() => {
          setCheckingAvailability(false);
          availabilityController.current = null;
        });
    }, 300);

    return () => {
      if (availabilityTimer.current) {
        clearTimeout(availabilityTimer.current);
        availabilityTimer.current = null;
      }
      if (availabilityController.current) {
        availabilityController.current.abort();
        availabilityController.current = null;
      }
    };
  }, [selectedRoom, dateTime]);

  // Helper: final server-side availability check (non-debounced)
  const finalAvailabilityCheck = async (roomId, datetime) => {
    const q = new URLSearchParams({ datetime }).toString();
    const res = await fetch(`/api/rooms/${encodeURIComponent(roomId)}/availability?${q}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Slot unavailable");
    }
    const body = await res.json();
    if (!body.available) throw new Error(body.message || "Slot unavailable");
    return true;
  };

  // Helper: create/confirm payment via backend
  const performPayment = async ({ amountCents = 0, currency = "USD", description = "" } = {}) => {

    // Example request to your backend to create a payment
    const res = await fetch("/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountCents, currency, description }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Payment creation failed");
    }

    const body = await res.json();

    // If backend returns a redirect URL (hosted payment), navigate user there and return a promise that will be resolved externally.
    if (body.redirectUrl) {
      window.location.href = body.redirectUrl;
      return { redirected: true };
    }

    if (body.paymentConfirmed) {
      return { confirmed: true, details: body };
    }

    // If backend returned a clientToken or requires client SDK confirm, pass it back to the caller.
    if (body.clientToken) {
      const confirmRes = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientToken: body.clientToken }),
      });
      if (!confirmRes.ok) {
        const cb = await confirmRes.json().catch(() => ({}));
        throw new Error(cb.message || "Payment confirmation failed");
      }
      const cb = await confirmRes.json();
      if (!cb.success) throw new Error(cb.message || "Payment not confirmed");
      return { confirmed: true, details: cb };
    }

    throw new Error("Unsupported payment response from server");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!selectedRoom) {
      setError("Please select a room.");
      return;
    }
    if (!dateTime || Number.isNaN(new Date(dateTime).getTime())) {
      setError("Please choose a valid date and time.");
      return;
    }
    if (isAvailable === false) {
      setError("Selected slot is unavailable. Choose another time or room.");
      return;
    }

    setSubmitting(true);

    try {
      // 1) Final availability check to avoid race conditions
      await finalAvailabilityCheck(selectedRoom, dateTime);

      const pricingRes = await fetch("/api/rooms/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: selectedRoom, datetime: dateTime }),
      });
      if (!pricingRes.ok) {
        const body = await pricingRes.json().catch(() => ({}));
        throw new Error(body.message || "Failed to compute price");
      }
      const pricing = await pricingRes.json();
      const amountCents = pricing?.amountCents ?? 0;
      const currency = pricing?.currency ?? "USD";
      const description = pricing?.description ?? `Booking ${selectedRoom} at ${dateTime}`;

      setPaymentProcessing(true);
      const paymentResult = await performPayment({ amountCents, currency, description });

      // If redirected to hosted payment, we stop here. The flow must resume when user returns via callback route.
      if (paymentResult.redirected) {
        setSubmitting(false);
        setPaymentProcessing(false);
        return;
      }

      if (!paymentResult.confirmed) {
        throw new Error("Payment was not completed");
      }

      // 4) Create booking only after payment confirmed
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoom,
          datetime: dateTime,
          paymentReference: paymentResult.details?.paymentReference || null,
        }),
      });

      if (!bookingRes.ok) {
        const body = await bookingRes.json().catch(() => ({}));
        throw new Error(body.message || "Booking creation failed after payment");
      }

      const booking = await bookingRes.json();
      setSuccessMsg("Booking confirmed. Thank you!");
      if (onSuccess) onSuccess(booking);
      setSubmitting(false);
      setPaymentProcessing(false);
      onHide();
    } catch (err) {
      setSubmitting(false);
      setPaymentProcessing(false);
      setError(err.message || "Booking/payment failed");
      if (onError) onError(err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book Room</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMsg && <Alert variant="success">{successMsg}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Room</Form.Label>
            {loadingRooms ? (
              <div className="d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-2" />
                <span>Loading rooms…</span>
              </div>
            ) : (
              <Form.Select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                required
              >
                <option value="">Choose a room…</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </Form.Group>

          <div className="mt-2">
            {checkingAvailability ? (
              <div className="text-muted d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-2" />
                <small>Checking availability…</small>
              </div>
            ) : isAvailable === null ? (
              <small className="text-muted">Select a room and time to check availability.</small>
            ) : isAvailable ? (
              <small className="text-success">{availabilityMessage || "Available"}</small>
            ) : (
              <small className="text-danger">{availabilityMessage || "Unavailable"}</small>
            )}
          </div>

          <div className="mt-3">
            <small className="text-muted">
              Booking is only confirmed after successful payment.
            </small>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={submitting || paymentProcessing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={
              submitting ||
              paymentProcessing ||
              checkingAvailability ||
              !selectedRoom ||
              !dateTime ||
              isAvailable === false
            }
          >
            {submitting || paymentProcessing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing…
              </>
            ) : (
              "Pay & Book"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BookRoomModal;