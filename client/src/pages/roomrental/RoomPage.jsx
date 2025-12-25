// client/src/pages/RoomPage.jsx
import React, { useCallback, useMemo } from "react";
import axios from "axios";
import {
  Container,
  Spinner,
  Alert,
  Button,
  Row,
  Col,
  Modal,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../contexts/AuthContext";
import UploadDocumentModal from "../../components/UploadDocumentModal";
import EmailSupportModal from "../../components/EmailSupportModal";
import RoomCardWithPay from "../../components/roomrentals/RoomCardWithPay";
import UserBookingsList from "../../components/roomrentals/UserBookingsList";
import BookingForm from "../../components/roomrentals/BookingForm";

/**
 * RoomPage
 * - Uses RoomCardWithPay (which calls onRequestBooking(room))
 * - Allows booking creation via BookingForm
 * - Uses apiBaseUrl for all requests; pass apiBaseUrl prop or configure dev proxy
 */
export default function RoomPage({
  apiBaseUrl,
  token,
  onProofSubmitted,
  headers = {},
}) {
  const { user } = React.useContext(AuthContext);
  const { t } = useTranslation();

  const isUser = Boolean(user && user.role !== "admin");

  // Rooms & bookings
  const [rooms, setRooms] = React.useState([]);
  const [loadingRooms, setLoadingRooms] = React.useState(true);
  const [errorRooms, setErrorRooms] = React.useState(null);

  const [bookings, setBookings] = React.useState([]);
  const [loadingBookings, setLoadingBookings] = React.useState(true);
  const [errorBookings, setErrorBookings] = React.useState(null);

  // UI state
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [emailSupportModal, setEmailSupportModal] = React.useState(false);
  const [selectedServiceId, setSelectedServiceId] = React.useState(null);
  const [showPayModal, setShowPayModal] = React.useState(false);

  // Booking modal
  const [bookingRoom, setBookingRoom] = React.useState(null);
  const [showBookingModal, setShowBookingModal] = React.useState(false);

  // Room details
  const [selectedRoom, setSelectedRoom] = React.useState(null);
  const [showDetails, setShowDetails] = React.useState(false);

  // refresh key
  const [refreshKey, setRefreshKey] = React.useState(0);

  // auth headers
  const authToken =
    token || user?.token || localStorage.getItem("authToken") || null;
  const defaultHeaders = useMemo(() => {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      // include any dynamic header values here (e.g. auth token)
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };
  }, [authToken]);

  const buildUrl = useCallback((path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    if (!apiBaseUrl) return normalizedPath;
    const base = apiBaseUrl.replace(/\/+$/, "");
    return `${base}${normalizedPath}`;
  }, [apiBaseUrl]);

  // Fetch rooms
  React.useEffect(() => {
    let mounted = true;
    if (!isUser) {
      setLoadingRooms(false);
      return () => (mounted = false);
    }

    setLoadingRooms(true);
    setErrorRooms(null);

    (async () => {
      try {
        const res = await axios.get(buildUrl("/api/rooms"), {
          headers: defaultHeaders,
        });
        const data = Array.isArray(res.data) ? res.data : res.data?.rooms || [];
        if (!mounted) return;
        setRooms(data);
      } catch (err) {
        console.error("Rooms fetch error:", err);
        if (!mounted) return;
        setErrorRooms("Failed to load rooms.");
      } finally {
        if (mounted) setLoadingRooms(false);
      }
    })();

    return () => (mounted = false);
  }, [user, refreshKey, apiBaseUrl, buildUrl, defaultHeaders, isUser]);

  // Fetch bookings
  React.useEffect(() => {
    let mounted = true;
    if (!isUser) {
      setLoadingBookings(false);
      return () => (mounted = false);
    }

    setLoadingBookings(true);
    setErrorBookings(null);

    (async () => {
      try {
        // Single reasonable endpoint
        const path = user?._id
          ? `/api/bookings?userId=${encodeURIComponent(user._id)}`
          : "/api/bookings";
        const res = await axios.get(buildUrl(path), {
          headers: defaultHeaders,
        });

        if (!mounted) return;
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.bookings || res.data || [];
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) {
          setBookings([]);
          setErrorBookings(
            "Bookings endpoint not available on the server. You can still create bookings; they will appear here after creation."
          );
        } else {
          console.warn("Bookings fetch error:", err);
          setBookings([]);
          setErrorBookings("Failed to load bookings.");
        }
      } finally {
        if (mounted) setLoadingBookings(false);
      }
    })();

    return () => (mounted = false);
  }, [user, refreshKey, apiBaseUrl, buildUrl, defaultHeaders, isUser]);

  // UI handlers
  const handlePayService = (serviceId) => {
    setSelectedServiceId(serviceId);
    setShowPayModal(true);
  };

  const handleClosePayModal = () => {
    setShowPayModal(false);
    setSelectedServiceId(null);
  };

  const handleOpenDetails = (room) => {
    setSelectedRoom(room);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedRoom(null);
    setShowDetails(false);
  };

  // RoomCardWithPay uses onRequestBooking prop
  const handleRequestBooking = (room) => {
    setBookingRoom(room);
    setShowBookingModal(true);
  };

  const handleCancelBooking = () => {
    setBookingRoom(null);
    setShowBookingModal(false);
  };

  // Called when booking is created by BookingForm
  const handleBooked = (createdBooking) => {
    if (createdBooking) {
      const b = createdBooking._id
        ? createdBooking
        : {
            _id: `local-${Date.now()}`,
            roomId: createdBooking.roomId || bookingRoom?._id,
            roomTitle:
              createdBooking.roomTitle ||
              bookingRoom?.roomTitle ||
              bookingRoom?.title ||
              bookingRoom?.name,
            startDate: createdBooking.startDate,
            endDate: createdBooking.endDate,
          };
      setBookings((prev) => [b, ...prev]);
    }
    setBookingRoom(null);
    setShowBookingModal(false);
    setRefreshKey((k) => k + 1);
  };

  const renderRooms = () => {
    if (loadingRooms) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      );
    }

    if (errorRooms) {
      return <Alert variant="danger">{errorRooms}</Alert>;
    }

    if (!rooms || rooms.length === 0) {
      return <div className="text-muted">No rooms available.</div>;
    }

    return (
      <Row>
        {rooms.map((r) => (
          <Col key={r._id} md={6} lg={4} className="mb-3">
            <RoomCardWithPay
              room={r}
              onRequestBooking={handleRequestBooking}
              onDetails={handleOpenDetails}
              onPay={() => handlePayService(r._id)}
              token={authToken}
            />
          </Col>
        ))}
      </Row>
    );
  };

  if (!isUser) {
    return (
      <Container style={{ padding: "2rem" }}>
        <Alert variant="warning" className="text-center">
          {t("dashboard.accessDenied") ||
            "Access denied. This area is for users only."}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container style={{ padding: "2rem" }}>
        <Tabs
          defaultActiveKey="overview"
          id="user-dashboard-tabs"
          className="mb-3"
        >
          <Tab
            eventKey="overview"
            title={t("dashboard.tabOverview") || "Overview"}
          >
            <div className="mt-3">
              <h5 className="mt-4 mb-3">
                {t("dashboard.availableRooms") || "Available rooms"}
              </h5>
              {renderRooms()}
            </div>
          </Tab>

          <Tab
            eventKey="bookings"
            title={t("dashboard.tabBookings") || "My Bookings"}
          >
            <UserBookingsList
              bookings={bookings}
              loadingBookings={loadingBookings}
              errorBookings={errorBookings}
              onCancelBooking={handleCancelBooking}
            />
          </Tab>
        </Tabs>

        <UploadDocumentModal
          show={showUploadModal}
          onHide={() => setShowUploadModal(false)}
          onSubmitted={onProofSubmitted}
        />
        <EmailSupportModal
          show={emailSupportModal}
          onHide={() => setEmailSupportModal(false)}
          userEmail={user?.email}
          serviceId={selectedServiceId}
        />

        <Modal show={showPayModal} onHide={handleClosePayModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t("dashboard.pay") || "Pay"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {t("dashboard.payConfirm") ||
                "You will be redirected to a secure payment page."}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePayModal}>
              {t("dashboard.cancel") || "Cancel"}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (selectedServiceId) {
                  window.location.href = `/payments/checkout?serviceId=${selectedServiceId}`;
                }
              }}
            >
              {t("dashboard.proceedToPay") || "Proceed to payment"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showBookingModal}
          onHide={handleCancelBooking}
          centered
          size="md"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {bookingRoom
                ? `Book: ${
                    bookingRoom.roomTitle ||
                    bookingRoom.title ||
                    bookingRoom.name
                  }`
                : "Book room"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {bookingRoom ? (
              <BookingForm
                room={bookingRoom}
                user={user}
                token={authToken}
                apiBaseUrl={apiBaseUrl}
                headers={headers}
                onBooked={handleBooked}
                onCancel={handleCancelBooking}
              />
            ) : (
              <div className="text-center py-3">
                <Spinner animation="border" />
              </div>
            )}
          </Modal.Body>
        </Modal>

        <Modal
          show={showDetails}
          onHide={handleCloseDetails}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedRoom?.roomTitle ||
                selectedRoom?.title ||
                selectedRoom?.name ||
                "Room details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRoom ? (
              <>
                {selectedRoom.imagePath ? (
                  <img
                    src={selectedRoom.imagePath}
                    alt={selectedRoom.title || "Room"}
                    className="img-fluid mb-3"
                    style={{
                      maxHeight: 300,
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                ) : null}
                <p>
                  {selectedRoom.roomDescription ||
                    selectedRoom.description ||
                    selectedRoom.summary ||
                    "No description available."}
                </p>
                <p>
                  <strong>Max guests:</strong>{" "}
                  {selectedRoom.roomCapacity || selectedRoom.capacity || "N/A"}
                </p>
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleCloseDetails();
                      handleRequestBooking(selectedRoom);
                    }}
                  >
                    Book this room
                  </Button>
                  <Button variant="secondary" onClick={handleCloseDetails}>
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-3">
                <Spinner animation="border" />
              </div>
            )}
          </Modal.Body>
        </Modal>
      </Container>

      <footer className="text-center py-4 border-top">
        <small>
          <p>
            <strong>{t("whoWeAre.footer.phones")}:</strong> (+244) 222 022 351;
            (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046
            <br />
            {t("whoWeAre.footer.address")}
          </p>
          © {new Date().getFullYear()} {t("lmLtd")}.{" "}
          {t("whoWeAre.footer.copyright")}
        </small>
      </footer>
    </>
  );
}
