// client/src/pages/UserOnlyDashboard.jsx
import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContext";
import UploadDocumentModal from "../components/UploadDocumentModal";
import EmailSupportModal from "../components/EmailSupportModal";
import UserDashboard from "../components/UserDashboard";
import ServiceCalendar from "../components/ServiceCalendar";
import UserCalendar from "../components/UserCalendar";
import RoomCardWithPay from "../components/roomrentals/RoomCardWithPay";

const BookingForm = ({
  room,
  user,
  token,
  apiBaseUrl,
  headers = {},
  onBooked,
  onCancel,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(room?.roomCapacity || room?.capacity || 1);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const authToken = token || user?.token || localStorage.getItem("authToken") || null;
  const defaultHeaders = {
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    "Cache-Control": "no-cache",
    ...headers,
  };

  const buildUrl = (path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    if (!apiBaseUrl) return normalizedPath;
    const base = apiBaseUrl.replace(/\/+$/, "");
    return `${base}${normalizedPath}`;
  };

  useEffect(() => {
    // reset messages when inputs change
    setError(null);
    setSuccessMsg(null);
  }, [startDate, endDate, guests, dateOfBirth, idFile]);

  const validate = () => {
    setError(null);
    if (!startDate || !endDate) {
      setError("Please select start and end dates.");
      return false;
    }
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      setError("Invalid dates.");
      return false;
    }
    if (e < s) {
      setError("End date must be the same or after start date.");
      return false;
    }
    if (guests < 1) {
      setError("Guests must be at least 1.");
      return false;
    }
    if (!dateOfBirth) {
      setError("Date of birth is required.");
      return false;
    }
    if (!idFile) {
      setError("Government ID / passport upload (idDocument) is required.");
      return false;
    }
    // file size check (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (idFile.size > maxSize) {
      setError("ID file is too large. Maximum 10MB allowed.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files?.[0] || null;
    setIdFile(file);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!validate()) return;

    setLoading(true);
    setProgress(0);

    // Build form data
    const formData = new FormData();
    formData.append("roomId", room?._id || "");
    formData.append("roomTitle", room?.roomTitle || room?.title || room?.name || "");
    formData.append("startDate", new Date(startDate).toISOString());
    formData.append("endDate", new Date(endDate).toISOString());
    formData.append("guestsCount", String(guests));
    formData.append("dateOfBirth", new Date(dateOfBirth).toISOString());
    formData.append("userId", user?._id || "");
    formData.append("userEmail", user?.email || "");

    formData.append("idDocument", idFile, idFile.name);

    const candidates = ["/api/bookings", "/bookings"];

    try {
      let created = null;
      for (const path of candidates) {
        try {
          const config = {
            headers: { ...defaultHeaders },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.lengthComputable) {
                const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                setProgress(percent);
              }
            },
            timeout: 120000, 
          };
          const res = await axios.post(buildUrl(path), formData, config);
          created = res?.data;
          break;
        } catch (err) {
          const status = err?.response?.status;
          if (status === 404) {
            continue;
          }
          throw err;
        }
      }

      if (!created) {
        throw new Error("No bookings endpoint accepted the request (404).");
      }

      setSuccessMsg("Booking created successfully.");
      setProgress(null);
      onBooked && onBooked(created);
    } catch (err) {
      console.error("Booking create error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Failed to create booking. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      {error && <Alert variant="danger">{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <div className="mb-2">
        <label className="form-label">Start date</label>
        <input
          className="form-control"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="form-label">End date</label>
        <input
          className="form-control"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Guests</label>
        <input
          className="form-control"
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Date of birth</label>
        <input
          className="form-control"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Government ID / Passport (required)</label>
        <input
          className="form-control"
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
          required
        />
        <small className="text-muted">Max 10MB. PDF or image formats accepted.</small>
      </div>

      {progress !== null && (
        <div className="mb-2">
          <div className="progress" style={{ height: 18 }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress}%
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Book room"}
        </Button>
      </div>
    </form>
  );
}

/**
 * UserOnlyDashboard
 * - Uses RoomCardWithPay (which calls onRequestBooking(room))
 * - Allows booking creation via BookingForm
 * - Uses apiBaseUrl for all requests; pass apiBaseUrl prop or configure dev proxy
 */
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
  const navigate = useNavigate();

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

  // refresh key
  const [refreshKey, setRefreshKey] = React.useState(0);

  // auth headers
  const authToken =
    token || user?.token || localStorage.getItem("authToken") || null;
  const defaultHeaders = {
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    "Cache-Control": "no-cache",
    ...headers,
  };

  const buildUrl = (path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    if (!apiBaseUrl) return normalizedPath;
    const base = apiBaseUrl.replace(/\/+$/, "");
    return `${base}${normalizedPath}`;
  };

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
  }, [user, refreshKey, apiBaseUrl, t, isUser]);

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
  }, [user, refreshKey, apiBaseUrl]);

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
  }, [user, refreshKey, apiBaseUrl]);

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
      // If server returned created booking, add it; otherwise create a minimal local booking
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

  const renderBookings = () => {
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

    if (!bookings || bookings.length === 0) {
      return <div className="text-muted">You have no bookings yet.</div>;
    }

    return (
      <Row>
        {bookings.map((b) => (
          <Col
            key={b._id || `${b.roomId}-${b.startDate}`}
            md={6}
            lg={4}
            className="mb-3"
          >
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
                  <UserDashboard
                    apiBaseUrl={apiBaseUrl}
                    user={user}
                    token={authToken}
                    initialServices={initialServices}
                    onProofSubmitted={onProofSubmitted}
                    onServiceSelect={onServiceSelect}
                  />

                  <hr />

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