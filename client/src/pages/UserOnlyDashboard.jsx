// client/src/pages/UserOnlyDashboard.jsx
import React, { useCallback, useMemo, useState } from "react";
import axios from "axios";
import {
  Container,
  Spinner,
  Alert,
  Button,
  Card,
  Row,
  Col,
  Modal,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContext";
import UploadDocumentModal from "../components/UploadDocumentModal";
import EmailSupportModal from "../components/EmailSupportModal";
import UserDashboard from "../components/UserDashboard";
import ServiceCalendar from "../components/ServiceCalendar";
import UserCalendar from "../components/UserCalendar";
import RoomCardWithPay from "../components/roomrentals/RoomCardWithPay";
import UserBookingsList from "../components/roomrentals/UserBookingsList";
import BookingFormWithModal from "../components/roomrentals/BookingFormWithModal";
import UploadProofModal from "../components/UploadProofModal";

export default function UserOnlyDashboard({
  apiBaseUrl,
  token,
  initialServices,
  onProofSubmitted,
  onServiceSelect,
  userId,
  headers = {},
}) {
  const { user } = React.useContext(AuthContext);
  const { t } = useTranslation();

  const isUser = Boolean(user && user.role !== "admin");

  // Services
  const [requestedServices, setRequestedServices] = React.useState(
    initialServices?.requested || []
  );
  const [scheduledServices, setScheduledServices] = React.useState(
    initialServices?.scheduled || []
  );
  const [sharedServices, setSharedServices] = React.useState(
    initialServices?.shared || []
  );
  const [loadingServices, setLoadingServices] = React.useState(
    !initialServices
  );
  const [errorRequested, setErrorRequested] = React.useState("");
  const [errorScheduled, setErrorScheduled] = React.useState("");
  const [errorShared, setErrorShared] = React.useState("");

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

  // Bank info modal (shown after booking when bank transfer selected)
  const [bankInfo, setBankInfo] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showUploadProofModal, setShowUploadProofModal] = useState(false);
  const [selectedServiceForProof, setSelectedServiceForProof] = useState(null);

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

  const buildUrl = useCallback(
    (path) => {
      const normalizedPath = path.startsWith("/") ? path : `/${path}`;
      if (!apiBaseUrl) return normalizedPath;
      const base = apiBaseUrl.replace(/\/+$/, "");
      return `${base}${normalizedPath}`;
    },
    [apiBaseUrl]
  );

  // Fetch services (requested, scheduled, shared)
  React.useEffect(() => {
    let mounted = true;
    if (!isUser) {
      setLoadingServices(false);
      return () => (mounted = false);
    }

    setLoadingServices(true);
    setErrorRequested("");
    setErrorScheduled("");
    setErrorShared("");

    const fetchRequested = async () => {
      try {
        const res = await axios.get(buildUrl("/api/requests"), {
          headers: defaultHeaders,
        });
        const filtered = Array.isArray(res.data)
          ? res.data.filter(
              (item) =>
                item.email === user.email || item.fullName === user.fullName
            )
          : [];
        if (!mounted) return;
        setRequestedServices(filtered);
      } catch (err) {
        console.error("Requested services error:", err);
        if (!mounted) return;
        setErrorRequested(
          t("dashboard.failedRequested") || "Failed to load requested services."
        );
      }
    };

    const fetchScheduled = async () => {
      try {
        const res = await axios.get(buildUrl("/api/schedules"), {
          headers: defaultHeaders,
        });
        const filtered = Array.isArray(res.data)
          ? res.data.filter((item) => item.fullName === user.fullName)
          : [];
        if (!mounted) return;
        setScheduledServices(filtered);
      } catch (err) {
        console.error("Scheduled services error:", err);
        if (!mounted) return;
        setErrorScheduled(
          t("dashboard.failedScheduled") || "Failed to load scheduled services."
        );
      }
    };

    const fetchShared = async () => {
      try {
        const res = await axios.get(buildUrl("/api/shares"), {
          headers: defaultHeaders,
        });
        const filtered = Array.isArray(res.data)
          ? res.data.filter((item) => item.email === user.email)
          : [];
        if (!mounted) return;
        setSharedServices(filtered);
      } catch (err) {
        console.error("Shared services error:", err);
        if (!mounted) return;
        setErrorShared(
          t("dashboard.failedShared") || "Failed to load shared services."
        );
      }
    };

    Promise.all([fetchRequested(), fetchScheduled(), fetchShared()]).finally(
      () => {
        if (mounted) setLoadingServices(false);
      }
    );

    return () => (mounted = false);
  }, [user, refreshKey, apiBaseUrl, t, isUser, buildUrl, defaultHeaders]);

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

  const renderServiceCards = (titleKey, services, error, typeKey) => (
    <>
      <h5 className="mt-4 mb-3">{t(titleKey)}</h5>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : services.length === 0 ? (
        <Alert variant="info" style={{ borderRadius: 24 }}>
          {t("dashboard.noServices", { type: t(typeKey) })}
        </Alert>
      ) : (
        <Row>
          {services.map((item) => (
            <Col md={6} lg={4} key={item._id} className="mb-3">
              <Card
                className="h-100 shadow-sm d-flex flex-column"
                style={{ borderRadius: 24, overflow: "hidden" }}
              >
                <Card.Body>
                  <Row className="h-100">
                    {/* Left: Text Content */}
                    <Col xs={6} className="d-flex flex-column">
                      <Card.Title>{item.serviceTitle}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {item.serviceType}
                      </Card.Subtitle>
                      <Card.Text>
                        {item.details || item.date || item.email}
                      </Card.Text>
                      <Card.Text>
                        <small className="text-muted">
                          {t("dashboard.created")}:{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </small>
                      </Card.Text>
                      <div className="mt-auto">
                        {item.paid ? (
                          <Button variant="success" disabled>
                            {t("dashboard.paid")}
                          </Button>
                        ) : (
                          <Button
                            variant="outline-primary"
                            onClick={() => handlePayService(item._id)}
                            style={{ borderRadius: 24 }}
                          >
                            {/* This render the Pay / Upload proof button */}
                            {t("dashboard.payInstructions")}
                          </Button>
                        )}
                      </div>
                    </Col>

                    {/* Right: Service Image */}
                    <Col
                      xs={6}
                      className="d-flex align-items-center justify-content-center"
                    >
                      {item.imagePath ? (
                        <img
                          src={item.imagePath}
                          alt={item.serviceTitle || "Service"}
                          className="img-fluid rounded"
                          style={{
                            maxHeight: "180px",
                            objectFit: "cover",
                            width: "100%",
                            borderRadius: "12px",
                            border: "1px solid #ddd",
                          }}
                        />
                      ) : (
                        <div className="text-muted text-center">
                          {t("dashboard.noImage")}
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );

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
        <h2 className="mb-2 text-center">{t("dashboard.title")}</h2>
        <h5 className="text-center mb-4">
          {t("dashboard.welcome", { name: user.fullName })}
        </h5>

        <div className="mb-3 text-center">
          <small className="text-muted">
            {t("dashboard.email")}: {user.email} · {t("dashboard.role")}:{" "}
            {user.role}
          </small>
        </div>

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

              <UserDashboard
                apiBaseUrl={apiBaseUrl}
                user={user}
                token={authToken}
                initialServices={initialServices}
                onProofSubmitted={onProofSubmitted}
                onServiceSelect={onServiceSelect}
              />
            </div>
          </Tab>

          <Tab
            eventKey="services"
            title={t("dashboard.tabServices") || "Services"}
          >
            <div className="mt-3">
              {loadingServices ? (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                </div>
              ) : (
                <>
                  <div>
                    <UserCalendar
                      apiBaseUrl={apiBaseUrl}
                      headers={headers}
                      user={user}
                    />
                  </div>

                  <hr />

                  <div className="dashboard-container">
                    <ServiceCalendar userId={userId} />
                  </div>

                  {renderServiceCards(
                    "dashboard.requested",
                    requestedServices,
                    errorRequested,
                    "dashboard.requestedType"
                  )}
                  {renderServiceCards(
                    "dashboard.scheduled",
                    scheduledServices,
                    errorScheduled,
                    "dashboard.scheduledType"
                  )}
                  {renderServiceCards(
                    "dashboard.shared",
                    sharedServices,
                    errorShared,
                    "dashboard.sharedType"
                  )}
                </>
              )}
            </div>
          </Tab>

          <Tab
            eventKey="bookings"
            title={t("dashboard.tabBookings") || "My Bookings"}
          >
            {/* <div className="mt-3">{renderBookings()}</div> */}
            <UserBookingsList
              bookings={bookings}
              loadingBookings={loadingBookings}
              errorBookings={errorBookings}
              // onEditBooking={handleEditBooking}
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
            <Modal.Title>{t("dashboard.pay") || "Bank details"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <ul style={{ listStyle: "none" }}>
                <li>
                  <strong>Bank:</strong> BFA
                </li>
                <li>
                  <strong>Accout name:</strong> Maria Miguel
                </li>
                <li>
                  <strong>Accout number:</strong> 34229556030001
                </li>
                <li>
                  <strong>IBAN:</strong> AO06 0006 0000 42295560301 25
                </li>
              </ul>
              <p style={{ fontWeight: 600, margin: 8 }}>
                Pay the service in the next <srong>48 hours</srong> to avoid
                cancellation. If you need help contact the support team{" "}
                <a href="mailto:lmj.muginga@gmail.com">LM-Ltd Team.</a>
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePayModal}>
              {t("dashboard.cancel") || "Cancel"}
            </Button>

            {/* Send Proof button that opens UploadProofModal */}
            <Button
              variant="primary"
              onClick={() => {
                if (selectedServiceId) {
                  setSelectedServiceForProof(selectedServiceId);
                  setShowUploadProofModal(true);
                  handleClosePayModal();
                }
              }}
            >
              {t("dashboard.sendProof") || "Send Proof"}
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

      {/* Bank instructions modal shown after booking when payment method is bank transfer */}
      <Modal show={showBankModal} onHide={closeBankModal} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>Payment instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bankInfo ? (
            <div>
              <p style={{ fontWeight: 600, marginBottom: 8 }}>
                Thank you for your booking. Pay the booking in the next{" "}
                <srong>48 hours</srong> to avoid cancellation. If you need help
                contact the support team{" "}
                <a href="mailto:lmj.muginga@gmail.com">LM-Ltd Team</a>. Please
                complete payment using the details below:
              </p>

              <div>
                <div>
                  <strong>Bank:</strong> {bankInfo.bankName}
                </div>
                <div>
                  <strong>Account name:</strong>
                  {""}
                  {bankInfo.accountName ?? bankInfo.owner}
                </div>
                <div>
                  <strong>Account number:</strong> {bankInfo.accountNumber}
                </div>
                <div>
                  <strong>IBAN:</strong> {bankInfo.routingNumber}
                </div>
                <div>
                  <strong>Reference:</strong> {bankInfo.reference}
                </div>
                <div>
                  <strong>Amount:</strong> {bankInfo.currency ?? "USD"}{" "}
                  {bankInfo.amount}
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

      <UploadProofModal
        show={showUploadProofModal}
        onHide={() => setShowUploadProofModal(false)}
        serviceId={selectedServiceForProof}
      />

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
