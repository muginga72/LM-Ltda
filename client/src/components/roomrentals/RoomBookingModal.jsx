// client/src/components/RoomBookingModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function RoomBookingModal({ show, onHide, room, apiBaseUrl, token, userId }) {
  const { t } = useTranslation();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [idFile, setIdFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setIdFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!idFile) return setError(t("roomBooking.error.uploadId"));
    if (!startDate || !endDate) return setError(t("roomBooking.error.dates"));
    if (!dateOfBirth) return setError(t("roomBooking.error.dob"));

    const form = new FormData();
    form.append("roomId", room?._id ?? room?.id ?? "");
    form.append("startDate", new Date(startDate).toISOString());
    form.append("endDate", new Date(endDate).toISOString());
    form.append("dateOfBirth", new Date(dateOfBirth).toISOString());
    form.append("guestsCount", String(guestsCount));
    form.append("idDocument", idFile);
    if (userId) form.append("userId", userId);

    setLoading(true);
    try {
      const res = await axios.post(`${apiBaseUrl.replace(/\/+$/, "")}/api/bookings`, form, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      });
      // success handling
      alert(t("roomBooking.success"));
      onHide();
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      setError(err.response?.data?.message || t("roomBooking.error.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{t("roomBooking.title", { roomName: room?.name ?? room?.title ?? "room" })}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-2">
            <Form.Label>{t("roomBooking.startDate")}</Form.Label>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>{t("roomBooking.endDate")}</Form.Label>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>{t("roomBooking.dateOfBirth")}</Form.Label>
            <Form.Control type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>{t("roomBooking.guests")}</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={guestsCount}
              onChange={(e) => setGuestsCount(Number(e.target.value || 1))}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>{t("roomBooking.idDocumentLabel")}</Form.Label>
            <Form.Control
              type="file"
              accept={t("roomBooking.file.accept")}
              onChange={handleFileChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            {t("roomBooking.cancel")}
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? t("roomBooking.booking") : t("roomBooking.book")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}