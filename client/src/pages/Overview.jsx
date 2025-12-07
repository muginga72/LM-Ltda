// src/pages/Overview.jsx
import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Modal, Spinner, Alert } from "react-bootstrap";
import RoomCardWithPay from "../../components/roomrentals/RoomCardWithPay";
import BookingForm from "../../components/roomrentals/BookingForm";
import { fetchRooms } from "../../api/roomsApi";

export default function Overview() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [bookingRoom, setBookingRoom] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await fetchRooms();
        if (!mounted) return;
        setRooms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load rooms", err);
        if (!mounted) return;
        setLoadError("Failed to load rooms. Try again later.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleRequestBooking = useCallback((room) => {
    console.log("🚀 Booking requested for:", room._id || room.id);
    setBookingRoom(room);
    setBookingModalOpen(true);
    setBookingSuccess(null);
  }, []);

  const handleBookingClose = useCallback(() => {
    setBookingModalOpen(false);
    setTimeout(() => setBookingRoom(null), 200);
  }, []);

  const handleBookingSuccess = useCallback((booking) => {
    setBookingSuccess(booking);
    setBookingModalOpen(false);
    setTimeout(() => setBookingRoom(null), 200);
    setTimeout(() => setBookingSuccess(null), 5000);
  }, []);

  return (
    <Container fluid className="py-3">
      <h3 className="mb-3">Overview</h3>

      {loading && (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" />
        </div>
      )}

      {loadError && <Alert variant="danger">{loadError}</Alert>}

      {!loading && !loadError && rooms.length === 0 && (
        <div className="text-muted">No rooms available.</div>
      )}

      <Row className="g-3">
        {rooms.map((r) => (
          <Col key={r._id || r.id} xs={12} sm={6} md={6} lg={4}>
            <RoomCardWithPay
              key={r._id}
              room={r}
              onRequestBooking={handleRequestBooking}
              onDetails={(room) => {
                console.log("Details requested for", room._id || room.id);
              }}
            />
          </Col>
        ))}
        {selectedRoom && (
        <div className="alert alert-success mt-3">
          Booking modal would open for: <strong>{selectedRoom.roomTitle}</strong>
        </div>
      )}

      </Row>

      {/* Single modal that renders the BookingForm for the selected room */}
      <Modal show={bookingModalOpen} onHide={handleBookingClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {bookingRoom ? `Book: ${bookingRoom.roomTitle || bookingRoom.title}` : "Book room"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {bookingRoom ? (
            <BookingForm
              room={bookingRoom}
              onSuccess={handleBookingSuccess}
              onClose={handleBookingClose}
            />
          ) : (
            <div className="text-center text-muted">No room selected.</div>
          )}
        </Modal.Body>
      </Modal>

      {/* Small success alert shown briefly after booking */}
      {bookingSuccess && (
        <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 1060 }}>
          <Alert variant="success" onClose={() => setBookingSuccess(null)} dismissible>
            Booking created successfully. Booking id: {bookingSuccess._id || bookingSuccess.id}
          </Alert>
        </div>
      )}
    </Container>
  );
}