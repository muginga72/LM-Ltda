// src/pages/roomrental/Rooms.jsx
import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../i18n";
import RoomCardWithPay from "../../components/roomrentals/RoomCardWithPay";
// import BookingModal from "../components/roomrentals/BookingModal";
// import PaymentModal from "../components/roomrentals/PaymentModal";
import { AuthContext } from "../../contexts/AuthContext";

/**
 * Rooms page
 * - Fetches rooms from /api/rooms
 * - Renders RoomCard grid
 * - Handles Book, Details, Pay actions
 *
 * Adjust API endpoints or token handling to match your app.
 */

export default function Rooms() {
  const { user } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const token = user?.token || localStorage.getItem("authToken") || null;
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking modal state
  // const [bookingRoom, setBookingRoom] = useState(null);
  // const [showBooking, setShowBooking] = useState(false);

  // Payment modal state
  // const [paymentRoom, setPaymentRoom] = useState(null);
  // const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/rooms", {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Failed to load rooms (${res.status})`);
        }
        const data = await res.json();
        if (!mounted) return;
        setRooms(Array.isArray(data) ? data : data.rooms || []);
      } catch (err) {
        if (!mounted) return;
        console.error("Rooms load error", err);
        setError(err.message || "Failed to load rooms");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  // function handleBook(room) {
  //   setBookingRoom(room);
  //   setShowBooking(true);
  // }

  function handleDetails(room) {
    navigate(`/rooms/${room._id}/details`);
  }

  // function handlePay(room) {
  //   setPaymentRoom(room);
  //   setShowPayment(true);
  // }

  // function onBooked(result) {
  // Called after successful booking (BookingModal calls onBooked)
  // Optionally refresh rooms or show confirmation
  // setShowBooking(false);
  // setBookingRoom(null);
  // refresh rooms if needed:
  // reloadRooms();
  // }

  return (
    <>
      <Container className="py-4">
        <h2 className="mb-3">Available rooms</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-muted">No rooms available.</div>
        ) : (
          <Row>
            {rooms.map((r) => (
              <Col key={r._id} md={6} lg={4}>
                <RoomCardWithPay
                  room={r}
                  // onBook={handleBook}
                  onDetails={handleDetails}
                  // onPay={handlePay}
                />
              </Col>
            ))}
          </Row>
        )}

        {/* <BookingModal
        show={showBooking}
        onHide={() => { setShowBooking(false); setBookingRoom(null); }}
        room={bookingRoom}
        token={token}
        onBooked={onBooked}
      /> */}

        {/* <PaymentModal
        show={showPayment}
        onHide={() => { setShowPayment(false); setPaymentRoom(null); }}
        room={paymentRoom}
        token={token}
      /> */}
      </Container>
      <div className="bg-warning text-dark text-center py-4">
        <Container>
          <h4 className="mb-2">{t("season.message")}</h4>
          <footer className="text-center py-1">
            <small>
              <p>
                Rua do Sapsapeiro F-7A, Sapú 2, Luanda, Angola <br />
                {t("footer.phone")}
              </p>
              &copy; {new Date().getFullYear()} {t("lmLtd")}.{" "}
              {t("footer.rights")}
            </small>
          </footer>
        </Container>
      </div>
    </>
  );
}
