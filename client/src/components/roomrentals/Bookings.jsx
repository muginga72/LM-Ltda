// src/components/roomrental/Bookings.jsx
import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { listMyBookings, cancelBooking, getBooking } from "../../api/bookingsApi";
import BookingListItem from "./BookingListItem";
import BookingDetails from "./BookingDetails";
import { useTranslation } from "react-i18next";

export default function Bookings() {
  const { t } = useTranslation();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMyBookings();
      setBookings(data);
    } catch (err) {
      setError(t("bookings.error.load"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (booking) => {
    if (!window.confirm(t("bookings.confirmCancel"))) return;
    try {
      await cancelBooking(booking._id);
      await load();
    } catch (err) {
      alert(t("bookings.error.cancel"));
    }
  };

  const handleView = async (booking) => {
    try {
      const data = await getBooking(booking._id);
      setSelected(data);
    } catch (err) {
      alert(t("bookings.error.details"));
    }
  };

  return (
    <Container>
      <h3 className="mb-3">{t("bookings.title")}</h3>

      {loading && <Spinner animation="border" />}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && bookings.length === 0 && (
        <div>{t("bookings.empty")}</div>
      )}

      {bookings.map((b) => (
        <BookingListItem
          key={b._id}
          booking={b}
          onCancel={handleCancel}
          onView={handleView}
        />
      ))}

      {selected && (
        <BookingDetails
          booking={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </Container>
  );
}