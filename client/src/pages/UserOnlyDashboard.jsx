// client/src/pages/UserOnlyDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UploadDocumentModal from "../components/UploadDocumentModal";
import EmailSupportModal from "../components/EmailSupportModal";
import { AuthContext } from "../contexts/AuthContext";
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
import { useNavigate } from "react-router-dom";
import UserDashboard from "../components/UserDashboard";
import ServiceCalendar from "../components/ServiceCalendar";
import UserCalendar from "../components/UserCalendar";
import { useTranslation } from "react-i18next";
import RoomCardWithPay from "../components/roomrentals/RoomCardWithPay";
// import PaymentModal from "../components/roomrentals/PaymentModal";

export default function UserOnlyDashboard({
  apiBaseUrl,
  token,
  initialServices,
  onProofSubmitted,
  onServiceSelect,
  userId,
  headers = {},
}) {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Determine whether current viewer is a non-admin user
  const isUser = Boolean(user && user.role !== "admin");

  // Services state
  const [requestedServices, setRequestedServices] = useState(
    initialServices?.requested || []
  );
  const [scheduledServices, setScheduledServices] = useState(
    initialServices?.scheduled || []
  );
  const [sharedServices, setSharedServices] = useState(
    initialServices?.shared || []
  );

  const [loadingServices, setLoadingServices] = useState(!initialServices);
  const [errorRequested, setErrorRequested] = useState("");
  const [errorScheduled, setErrorScheduled] = useState("");
  const [errorShared, setErrorShared] = useState("");

  // Rooms state
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [errorRooms, setErrorRooms] = useState(null);

  // Bookings (placeholder)
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [errorBookings, setErrorBookings] = useState(null);

  // UI state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [emailSupportModal, setEmailSupportModal] = useState(false);

  // Payment / booking selection state
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);

  // Room payment modal
  const [paymentRoom, setPaymentRoom] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Room details / booking state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  // refresh key to re-fetch lists when needed
  const [refreshKey] = useState(0);
  
  // Build headers (prefer token prop, otherwise use user.token)
  const authToken =
    token || user?.token || localStorage.getItem("authToken") || null;
  const defaultHeaders = {
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    "Cache-Control": "no-cache",
    ...headers,
  };

  // Fetch services (requested, scheduled, shared)
  useEffect(() => {
    let mounted = true;
    if (!isUser) {
      setLoadingServices(false);
      return () => {
        mounted = false;
      };
    }

    setLoadingServices(true);
    setErrorRequested("");
    setErrorScheduled("");
    setErrorShared("");

    const fetchRequested = async () => {
      try {
        const res = await axios.get("/api/requests", {
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
        const res = await axios.get("/api/schedules", {
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
        const res = await axios.get("/api/shares", { headers: defaultHeaders });
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

    return () => {
      mounted = false;
    };
  }, [user, refreshKey, apiBaseUrl, t, isUser]);

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
        const res = await axios.get("/api/rooms", { headers: defaultHeaders });
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

    return () => {
      mounted = false;
    };
  }, [user, refreshKey]);

  // Fetch bookings (placeholder) — replace endpoint with your real bookings API
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
        const res = await axios.get("/api/bookings/my", {
          headers: defaultHeaders,
        });
        if (!mounted) return;
        setBookings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.warn("Bookings fetch warning:", err);
        if (!mounted) return;
        setBookings([]);
      } finally {
        if (mounted) setLoadingBookings(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user, refreshKey]);

  // UI handlers
  const handlePayService = (serviceId) => {
    setSelectedServiceId(serviceId);
    setShowPayModal(true);
  };

  const handleClosePayModal = () => {
    setShowPayModal(false);
    setSelectedServiceId(null);
  };

  const handleDetails = (room) => {
    navigate(`/rooms/${room._id}/details`);
  };

  const handlePayRoom = (room) => {
    setPaymentRoom(room);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentRoom(null);
  };

  // Render helpers
  const renderServiceSummary = (services, title) => {
    if (!services || services.length === 0) {
      return (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <div className="text-muted">
              {t("dashboard.noServicesShort") || "No items"}
            </div>
          </Card.Body>
        </Card>
      );
    }

    return (
      <Row className="mb-3">
        {services.slice(0, 3).map((s) => (
          <Col key={s._id} md={6} lg={4} className="mb-2">
            <Card>
              <Card.Body>
                <Card.Title className="mb-1">
                  {s.serviceTitle || s.title}
                </Card.Title>
                <Card.Text className="text-muted small">
                  {s.serviceType || s.details || s.date}
                </Card.Text>
                <div className="d-flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant={s.paid ? "success" : "outline-primary"}
                    onClick={() => handlePayService(s._id)}
                  >
                    {s.paid
                      ? t("dashboard.paid") || "Paid"
                      : t("dashboard.pay") || "Pay"}
                  </Button>
                  <Button
                    size="sm"
                    variant="link"
                    onClick={() => onServiceSelect?.(s)}
                  >
                    {t("dashboard.view") || "View"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const renderServiceCards = (titleKey, services, error, typeKey) => (
    <>
      <h5 className="mt-4 mb-3">{t(titleKey)}</h5>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : services.length === 0 ? (
        <Alert variant="info">
          {t("dashboard.noServices", { type: t(typeKey) })}
        </Alert>
      ) : (
        <Row>
          {services.map((item) => (
            <Col md={6} lg={4} key={item._id} className="mb-3">
              <Card className="h-100">
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
                          >
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
              onDetails={(room) => handleDetails(room)}
              onPay={(room) => handlePayRoom(room)}
            />
          </Col>
        ))}
      </Row>
    );
  };

  const renderBookings = () => {
    if (loadingBookings) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      );
    }

    if (errorBookings) {
      return <Alert variant="danger">{errorBookings}</Alert>;
    }

    if (!bookings || bookings.length === 0) {
      return <div className="text-muted">You have no bookings yet.</div>;
    }

    return (
      <Row>
        {bookings.map((b) => (
          <Col key={b._id} md={6} lg={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{b.roomTitle || b.title || "Booking"}</Card.Title>
                <Card.Text>
                  {b.startDate
                    ? `${new Date(
                        b.startDate
                      ).toLocaleDateString()} - ${new Date(
                        b.endDate
                      ).toLocaleDateString()}`
                    : "Dates not specified"}
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => navigate(`/rooms/${b.roomId}/details`)}
                  >
                    View room
                  </Button>
                  <Button size="sm" variant="outline-secondary" disabled>
                    Manage
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  // Overview tab: show UserDashboard, calendars, and compact services + rooms
  const renderOverview = () => (
    <>
      <h4 className="mb-3 text-center">{t("dashboard.overview")}</h4>

      <h5 className="mt-4 mb-3">
        {t("dashboard.availableRooms") || "Available rooms"}
      </h5>

      {/* ------------ Rendering Rooms ----------- */}
      {renderRooms()}

      <UserDashboard
        apiBaseUrl={apiBaseUrl}
        user={user}
        token={authToken}
        initialServices={initialServices}
        onProofSubmitted={onProofSubmitted}
        onServiceSelect={onServiceSelect}
      />

      <hr />

      <div className="dashboard-container">
        <ServiceCalendar userId={userId} />
      </div>

      <hr />

      <div>
        <UserCalendar apiBaseUrl={apiBaseUrl} headers={headers} user={user} />
      </div>

      <hr />

      {loadingServices || loadingRooms ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>{t("dashboard.loading")}</p>
        </div>
      ) : (
        <>
          {renderServiceCards(
            "dashboard.requested",
            requestedServices,
            errorRequested,
            "dashboard.requested"
          )}
          {renderServiceCards(
            "dashboard.scheduled",
            scheduledServices,
            errorScheduled,
            "dashboard.scheduled"
          )}
          {renderServiceCards(
            "dashboard.shared",
            sharedServices,
            errorShared,
            "dashboard.shared"
          )}
        </>
      )}
    </>
  );

  // Final render: if not allowed, show access denied; hooks already ran above.
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
            <div className="mt-3">{renderOverview()}</div>
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

          <Tab eventKey="rooms" title={t("dashboard.tabRooms") || "Rooms"}>
            <div className="mt-3">{renderRooms()}</div>
          </Tab>

          <Tab
            eventKey="bookings"
            title={t("dashboard.tabBookings") || "My Bookings"}
          >
            <div className="mt-3">{renderBookings()}</div>
          </Tab>
        </Tabs>

        {/* Upload / Support modals */}
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

        {/* Service pay confirmation modal */}
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
                  // Example: redirect to payment for selectedServiceId
                  // To be replaced with real payment flow
                  window.location.href = `/payments/checkout?serviceId=${selectedServiceId}`;
                }
              }}
            >
              {t("dashboard.proceedToPay") || "Proceed to payment"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Room payment modal ---- For the Future ------- */}
        {/* <PaymentModal show={showPaymentModal} onHide={handleClosePaymentModal} room={paymentRoom} token={authToken} /> */}
      </Container>

      {/* ---------------------------  FOOTER  ---------------------------- */}
      <footer className="text-center py-4 border-top">
        <small>
          <p>
            <strong>{t("whoWeAre.footer.phones")}:</strong> (+244) 222 022 351;
            (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046
            <br />
            {t("whoWeAre.footer.address")}
          </p>
          &copy; {new Date().getFullYear()} {t("lmLtd")}.{" "}
          {t("whoWeAre.footer.copyright")}
        </small>
      </footer>
    </>
  );
}