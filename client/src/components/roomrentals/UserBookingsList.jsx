import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";

export default function UserBookingsList({
  bookings = [],
  loadingBookings = false,
  errorBookings = null,
  // onUpdateBooking,
  onCancelBooking,
}) {
  const [localBookings, setLocalBookings] = useState(bookings);

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  // Manage modal form state
  const [formState, setFormState] = useState({
    startDate: "",
    endDate: "",
    guests: 1,
    notes: "",
  });
  const [ saving ] = useState(false);
  const [ cancelling ] = useState(false);
  const [manageError, setManageError] = useState(null);
  const [manageSuccess, setManageSuccess] = useState(null);

  // Helpers
  const openViewModal = (booking) => {
    setSelectedBooking(booking);
    setShowViewModal(true);
  };

  const openManageModal = (booking) => {
    setSelectedBooking(booking);
    setFormState({
      startDate: booking.startDate ? booking.startDate.slice(0, 10) : "",
      endDate: booking.endDate ? booking.endDate.slice(0, 10) : "",
      guests: booking.guests || 1,
      notes: booking.notes || "",
    });
    setManageError(null);
    setManageSuccess(null);
    setShowManageModal(true);
  };

  const closeViewModal = () => {
    setSelectedBooking(null);
    setShowViewModal(false);
  };

  const closeManageModal = () => {
    setSelectedBooking(null);
    setShowManageModal(false);
    setManageError(null);
    setManageSuccess(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: name === "guests" ? Number(value) : value }));
  };

  // Render logic (replaces your renderBookings)
  if (loadingBookings) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (errorBookings) {
    return <Alert variant="warning">{errorBookings}</Alert>;
  }

  if (!localBookings || localBookings.length === 0) {
    return <div className="text-muted">You have no bookings yet.</div>;
  }

  return (
    <>
      <Row>
        {localBookings.map((b) => (
          <Col key={b._id || `${b.roomId}-${b.startDate}`} md={6} lg={4} className="mb-3">
            <Card>
              {b.roomImage && (
                <Card.Img variant="top" src={b.roomImage} alt={b.roomTitle || "Room image"} />
              )}
              <Card.Body>
                <Card.Title>{b.roomTitle || b.title || "Booking"}</Card.Title>
                <Card.Text>
                  {b.startDate
                    ? `${new Date(b.startDate).toLocaleDateString()} - ${new Date(
                        b.endDate
                      ).toLocaleDateString()}`
                    : "Dates not specified"}
                </Card.Text>
                <Card.Text>
                  <strong>Status:</strong> {b.status || "Unknown"}
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => openViewModal(b)}>
                    View room
                  </Button>
                  <Button size="sm" variant="outline-secondary" onClick={() => openManageModal(b)}>
                    Manage
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* View Room Modal */}
      <Modal show={showViewModal} onHide={closeViewModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedBooking?.roomTitle || "Room details"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking ? (
            <>
              {selectedBooking.roomImage && (
                <img
                  src={selectedBooking.roomImage}
                  alt={selectedBooking.roomTitle || "Room image"}
                  className="img-fluid mb-3"
                />
              )}
              <p>
                <strong>Booking dates:</strong>{" "}
                {selectedBooking.startDate
                  ? `${new Date(selectedBooking.startDate).toLocaleDateString()} - ${new Date(
                      selectedBooking.endDate
                    ).toLocaleDateString()}`
                  : "Not specified"}
              </p>
              <p>
                <strong>Guests:</strong> {selectedBooking.guests || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {selectedBooking.status || "Unknown"}
              </p>
              <p>
                <strong>Description:</strong> {selectedBooking.roomDescription || "Unknown"}
              </p>
              {selectedBooking.notes && (
                <p>
                  <strong>Notes:</strong> {selectedBooking.notes}
                </p>
              )}
              {/* Add any other room details you have (e.g., description, amenities) */}
            </>
          ) : (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeViewModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // Open manage modal from view modal
              if (selectedBooking) {
                setShowViewModal(false);
                openManageModal(selectedBooking);
              }
            }}
          >
            Manage booking
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Manage Booking Modal */}
      <Modal show={showManageModal} onHide={closeManageModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Manage booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {manageError && <Alert variant="danger">{manageError}</Alert>}
          {manageSuccess && <Alert variant="success">{manageSuccess}</Alert>}

          <Form>
            <Form.Group className="mb-2" controlId="formStartDate">
              <Form.Label>Start date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formState.startDate}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formEndDate">
              <Form.Label>End date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formState.endDate}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formGuests">
              <Form.Label>Guests</Form.Label>
              <Form.Control
                type="number"
                min={1}
                name="guests"
                value={formState.guests}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formNotes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formState.notes}
                onChange={handleFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>
            {/* <Button
              variant="danger"
              onClick={handleCancelBooking}
              disabled={cancelling || saving}
            >
              {cancelling ? (
                <>
                  <Spinner as="span" animation="border" size="sm" /> Cancelling...
                </>
              ) : (
                "Cancel booking"
              )}
            </Button> */}
          </div>

          <div>
            <Button variant="secondary" onClick={closeManageModal} disabled={saving || cancelling}>
              Close
            </Button>
            {/* <Button
              variant="primary"
              // onClick={handleSave}
              disabled={saving || cancelling}
              className="ms-2"
            >
              {saving ? (
                <>
                  <Spinner as="span" animation="border" size="sm" /> Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button> */}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}