// client/src/pages/RoomPage.jsx
import React, { useCallback, useMemo, useState, useEffect, useContext } from "react";
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
import BookingFormWithModal from "../../components/roomrentals/BookingFormWithModal";

export default function RoomPage({ apiBaseUrl, token, onProofSubmitted, headers = {} }) {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  const isUser = Boolean(user && user.role !== "admin");

  // Rooms & bookings
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [errorRooms, setErrorRooms] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [errorBookings, setErrorBookings] = useState(null);

  // UI state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [emailSupportModal, setEmailSupportModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);

  // Booking modal
  const [bookingRoom, setBookingRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Room details
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Bank info modal (shown after booking when bank transfer selected)
  const [bankInfo, setBankInfo] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);

  // refresh key
  const [refreshKey, setRefreshKey] = useState(0);

  // auth token (stable)
  const authToken = useMemo(() => {
    return token || user?.token || localStorage.getItem("authToken") || null;
  }, [token, user?.token]);

  // default headers memoized to avoid recreating object each render
  const defaultHeaders = useMemo(() => {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, JSON.stringify(headers)]); // stringify headers to detect changes without recreating object each render

  // buildUrl memoized only on apiBaseUrl
  const buildUrl = useCallback(
    (path) => {
      const normalizedPath = path.startsWith("/") ? path : `/${path}`;
      if (!apiBaseUrl) return normalizedPath;
      const base = apiBaseUrl.replace(/\/+$/, "");
      return `${base}${normalizedPath}`;
    },
    [apiBaseUrl]
  );

  // Fetch rooms
  useEffect(() => {
    let mounted = true;
    if (!isUser) {
      setLoadingRooms(false);
      return () => {
        mounted = false;
      };
    }

    setLoadingRooms(true);
    setErrorRooms(null);

    (async () => {
      try {
        const res = await axios.get(buildUrl("/api/rooms"), {
          headers: defaultHeaders,
        });
        const data = Array.isArray(res.data) ? res.data : res.data?.rooms ?? [];
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

    return () => {
      mounted = false;
    };
    // Intentionally depend on isUser and refreshKey and authToken only to avoid loops
  }, [isUser, refreshKey, buildUrl, authToken, defaultHeaders]);

  // Fetch bookings
  useEffect(() => {
    let mounted = true;
    if (!isUser) {
      setLoadingBookings(false);
      return () => {
        mounted = false;
      };
    }

    setLoadingBookings(true);
    setErrorBookings(null);

    (async () => {
      try {
        const path = user?._id
          ? `/api/bookings?userId=${encodeURIComponent(user._id)}`
          : "/api/bookings";

        const res = await axios.get(buildUrl(path), {
          headers: defaultHeaders,
        });

        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : res.data?.bookings ?? res.data ?? [];
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

    return () => {
      mounted = false;
    };
    // Depend on user._id and refreshKey and authToken only
  }, [isUser, refreshKey, buildUrl, authToken, defaultHeaders, user?._id]);

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
            id: `local-${Date.now()}`,
            roomId: createdBooking.roomId ?? bookingRoom?._id,
            roomTitle:
              createdBooking.roomTitle ??
              bookingRoom?.roomTitle ??
              bookingRoom?.title ??
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

  // Called by BookingFormWithModal when it wants to show bank instructions
  const handleShowPayInstructions = (info) => {
    setBankInfo(info);
    setShowBankModal(true);
  };

  const closeBankModal = () => {
    setShowBankModal(false);
    setBankInfo(null);
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
          <Col key={r._id ?? r.id} md={6} lg={4} className="mb-3">
            <RoomCardWithPay
              room={r}
              onRequestBooking={handleRequestBooking}
              onDetails={handleOpenDetails}
              onPay={() => handlePayService(r._id ?? r.id)}
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
          {t("dashboard.accessDenied") || "Access denied. This area is for users only."}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container style={{ padding: "2rem" }}>
        <Tabs defaultActiveKey="overview" id="user-dashboard-tabs" className="mb-3">
          <Tab eventKey="overview" title={t("dashboard.tabOverview") || "Overview"}>
            <div className="mt-3">
              <h5 className="mt-4 mb-3">{t("dashboard.availableRooms") || "Available rooms"}</h5>
              {renderRooms()}
            </div>
          </Tab>

          <Tab eventKey="bookings" title={t("dashboard.tabBookings") || "My Bookings"}>
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
            <p>{t("dashboard.payConfirm") || "You will be redirected to a secure payment page."}</p>
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

        {/* Booking modal: contains BookingFormWithModal which will call onShowPayInstructions when needed */}
        <Modal show={showBookingModal} onHide={handleCancelBooking} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {bookingRoom
                ? `Book: ${bookingRoom.roomTitle ?? bookingRoom.title ?? bookingRoom.name}`
                : "Book room"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {bookingRoom ? (
              <BookingFormWithModal
                room={bookingRoom}
                user={user}
                token={authToken}
                apiBaseUrl={apiBaseUrl}
                headers={defaultHeaders}
                onBooked={(created) => {
                  handleBooked(created);
                }}
                onCancel={handleCancelBooking}
                onShowPayInstructions={handleShowPayInstructions}
              />
            ) : (
              <div className="text-center py-3">
                <Spinner animation="border" />
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Room details modal */}
        <Modal show={showDetails} onHide={handleCloseDetails} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedRoom?.roomTitle ?? selectedRoom?.title ?? selectedRoom?.name ?? "Room details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRoom ? (
              <>
                {selectedRoom.imagePath ? (
                  <img
                    src={selectedRoom.imagePath}
                    alt={selectedRoom.title ?? "Room"}
                    className="img-fluid mb-3"
                    style={{ maxHeight: 300, objectFit: "cover", width: "100%" }}
                  />
                ) : null}
                <p>
                  {selectedRoom.roomDescription ??
                    selectedRoom.description ??
                    selectedRoom.summary ??
                    "No description available."}
                </p>
                <p>
                  <strong>Max guests: </strong>
                  {selectedRoom.roomCapacity ?? selectedRoom.capacity ?? "N/A"}
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

      {/* Bank instructions modal shown after booking when payment method is bank transfer */}
      <Modal show={showBankModal} onHide={closeBankModal} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>Payment instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bankInfo ? (
            <div>
              <p style={{ fontWeight: 600, marginBottom: 8 }}>Thank you for your booking</p>
              <p>Please complete payment using the details below:</p>

              <div>
                <div>
                  <strong>Bank:</strong> {bankInfo.bankName}
                </div>
                <div>
                  <strong>Account name:</strong> {bankInfo.accountName ?? bankInfo.owner}
                </div>
                <div>
                  <strong>Account number:</strong> {bankInfo.accountNumber}
                </div>
                <div>
                  <strong>Routing / Sort code:</strong> {bankInfo.routingNumber}
                </div>
                <div>
                  <strong>IBAN:</strong> {bankInfo.iban}
                </div>
                <div>
                  <strong>Reference:</strong> {bankInfo.reference}
                </div>
                <div>
                  <strong>Amount:</strong> {bankInfo.currency ?? "USD"} {bankInfo.amount}
                </div>
              </div>
            </div>
          ) : (
            <div>Loading payment details…</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeBankModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <footer className="text-center py-4 border-top">
        <small>
          <p>
            <strong>{t("whoWeAre.footer.phones") || "Phones"}:</strong> (+244) 222 022 351; (+244) 942 154 545;
            (+244) 921 588 083; (+244) 939 207 046
            <br />
            {t("whoWeAre.footer.address") || ""}
          </p>
          <p>
            &copy; {new Date().getFullYear()} ImLtd. {t("whoWeAre.footer.copyright") || ""}
          </p>
        </small>
      </footer>
    </>
  );
}