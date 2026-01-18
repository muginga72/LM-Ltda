// src/pages/UserOnlyDashboard.jsx
import React, { useCallback, useMemo, useState, useEffect, useContext, } from "react";
import axios from "axios";
import { Container, Spinner, Alert, Button, Card, Row, Col, Modal, Tabs, Tab, } from "react-bootstrap";
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
import ScheduleServiceModal from "../components/ScheduleServiceModal";
import RequestServiceModal from "../components/RequestServiceModal";

export default function UserOnlyDashboard({ apiBaseUrl, token, initialServices, onProofSubmitted, onServiceSelect, userId, headers = {}, }) {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const isUser = Boolean(user && user.role !== "admin");

  // Services
  const [requestedServices, setRequestedServices] = useState(
    (initialServices && initialServices.requested) || []
  );
  const [scheduledServices, setScheduledServices] = useState(
    (initialServices && initialServices.scheduled) || []
  );
  const [sharedServices, setSharedServices] = useState(
    (initialServices && initialServices.shared) || []
  );
  const [loadingServices, setLoadingServices] = useState(!initialServices);
  const [errorRequested, setErrorRequested] = useState("");
  const [errorScheduled, setErrorScheduled] = useState("");
  const [errorShared, setErrorShared] = useState("");

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

  // Upload proof modal state (expects a service id)
  const [showUploadProofModal, setShowUploadProofModal] = useState(false);
  const [selectedServiceForProof, setSelectedServiceForProof] = useState(null);

  // Modals for services
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // refresh key
  const [refreshKey, setRefreshKey] = useState(0);

  // auth headers
  const authToken =
    token || (user && user.token) || localStorage.getItem("authToken") || null;
  const defaultHeaders = useMemo(() => {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
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
        const res = await axios.get(buildUrl("/api/requests"), {
          headers: defaultHeaders,
        });
        const filtered = Array.isArray(res.data)
          ? res.data.filter(
              (item) =>
                (item.email && user && item.email === user.email) ||
                (item.fullName && user && item.fullName === user.fullName)
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
          ? res.data.filter((item) => user && item.fullName === user.fullName)
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
          ? res.data.filter((item) => user && item.email === user.email)
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
  }, [user, refreshKey, apiBaseUrl, t, isUser, buildUrl, defaultHeaders]);

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
  }, [user, refreshKey, apiBaseUrl, buildUrl, defaultHeaders, isUser]);

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
        const path =
          user && user._id
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

    return () => {
      mounted = false;
    };
  }, [user, refreshKey, apiBaseUrl, buildUrl, defaultHeaders, isUser]);

  // UI handlers
  const handlePayService = (serviceId) => {
    setSelectedServiceId(serviceId);
    setShowPayModal(true);
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
            roomId: createdBooking.roomId || (bookingRoom && bookingRoom._id),
            roomTitle:
              createdBooking.roomTitle ||
              (bookingRoom &&
                (bookingRoom.roomTitle ||
                  bookingRoom.title ||
                  bookingRoom.name)),
            startDate: createdBooking.startDate,
            endDate: createdBooking.endDate,
          };
      setBookings((prev) => [b, ...prev]);
    }
    setBookingRoom(null);
    setShowBookingModal(false);
    setRefreshKey((k) => k + 1);
  };

  const renderActionButton = (service, listType) => {
    if (listType === "scheduled") {
      if (service.paid) {
        return (
          <Button variant="success" disabled>
            {t("dashboard.paid")}
          </Button>
        );
      }

      // derive id
      const id = service._id || service.id || service.serviceId || null;

      return (
        <Button
          variant="outline-primary"
          onClick={async () => {
            setSelectedServiceForProof(id);

            let amount =
              service &&
              (service.price ||
                service.amount ||
                service.total ||
                service.cost);

            if (!amount && id) {
              try {
                const url = buildUrl(`/api/services/${encodeURIComponent(id)}`);
                const res = await axios.get(url, { headers: defaultHeaders });
                const svc = res && res.data ? res.data : null;
                amount =
                  svc && (svc.price || svc.amount || svc.total || svc.cost)
                    ? svc.price || svc.amount || svc.total || svc.cost
                    : amount;
              } catch (err) {
                console.warn(
                  "Could not fetch service details for amount:",
                  err
                );
              }
            }

            const info = {
              bankName: service?.bankName || "BFA",
              accountName: service?.accountName || "Maria Miguel",
              accountNumber: service?.accountNumber || "34229556030001",
              routingNumber:
                service?.routingNumber || "AO06 0006 0000 42295560301 25",
              reference:
                service?.reference ||
                `SERVICE-${id || Date.now()}-${Math.floor(
                  Math.random() * 9000 + 1000
                )}`,
              serviceId: id,
              serviceTitle:
                service?.serviceTitle || service?.title || service?.name || "",
            };

            setBankInfo(info);
            setShowBankModal(true);

            const openUploadProof = () => {
              setShowUploadProofModal(true);
            };

            const onHidden = (ev) => {
              try {
                openUploadProof();
              } finally {
                document.removeEventListener("hidden.bs.modal", onHidden);
              }
            };
            try {
              document.addEventListener("hidden.bs.modal", onHidden, {
                once: true,
              });
            } catch (e) {
              document.addEventListener("hidden.bs.modal", onHidden);
            }

            let checks = 0;
            const maxChecks = (20 * 1000) / 300; // ~20s
            const poll = setInterval(() => {
              checks += 1;
              const anyVisibleModal = !!document.querySelector(".modal.show");
              if (!anyVisibleModal) {
                clearInterval(poll);
                openUploadProof();
              } else if (checks >= maxChecks) {
                clearInterval(poll);
                openUploadProof();
              }
            }, 300);
          }}
          style={{ borderRadius: 24 }}
        >
          {t("dashboard.payInstructions")}
        </Button>
      );
    }

    // Requested -> Schedule Service ONLY
    if (listType === "requested") {
      return (
        <Button
          variant="warning"
          onClick={() => {
            setSelectedService(service);
            setShowScheduleModal(true);
          }}
          style={{ borderRadius: 24 }}
        >
          {t("dashboard.scheduleService")}
        </Button>
      );
    }

    // Shared -> Request Service ONLY
    if (listType === "shared") {
      return (
        <Button
          variant="info"
          onClick={() => {
            setSelectedService(service);
            setShowRequestModal(true);
          }}
          style={{ borderRadius: 24 }}
        >
          {t("dashboard.requestService")}
        </Button>
      );
    }

    return null;
  };

  const renderServiceCards = (titleKey, services, error, typeKey, listType) => (
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
            <Col md={6} lg={4} key={item._id || item.id} className="mb-3">
              <Card
                className="h-100 shadow-sm d-flex flex-column"
                style={{ borderRadius: 24, overflow: "hidden" }}
              >
                <Card.Body>
                  <Row className="h-100">
                    {/* Left: Text Content */}
                    <Col xs={6} className="d-flex flex-column">
                      <Card.Title>
                        {item.serviceTitle || item.serviceTitle || item.title}
                      </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {item.serviceType || item.serviceType || item.type}
                      </Card.Subtitle>
                      <Card.Text>
                        {item.details || item.date || item.email || ""}
                      </Card.Text>
                      <Card.Text>
                        <small className="text-muted">
                          {t("dashboard.created")}: {""}
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : ""}
                        </small>
                      </Card.Text>
                      <div className="mt-auto">

                        {/*================================================= 
                            Use the centralized action button logic 
                        =================================================*/}

                        {renderActionButton(item, listType)}

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
            {t("dashboard.email")}: {user.email} . {t("dashboard.role")}:{" "}
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
                    "dashboard.requestedType",
                    "requested"
                  )}
                  {renderServiceCards(
                    "dashboard.scheduled",
                    scheduledServices,
                    errorScheduled,
                    "dashboard.scheduledType",
                    "scheduled"
                  )}
                  {renderServiceCards(
                    "dashboard.shared",
                    sharedServices,
                    errorShared,
                    "dashboard.sharedType",
                    "shared"
                  )}
                </>
              )}
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
                  <strong>Max guests :</strong>{" "}
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
                <strong>48 hours</strong> to avoid cancellation. If you need
                help contact the support team{" "}
                <a href="mailto:lmj.muginga@gmail.com">LM-Ltd Team</a>. Please
                complete payment using the details below:
              </p>
              <div>
                <div>
                  <strong>Bank:</strong> {bankInfo.bankName}
                </div>
                <div>
                  <strong>Account name:</strong>{" "}
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
                </div> <br/>
                <p style={{ fontWeight: 600, marginBottom: 8 }}>
                  <small><strong>Note:</strong> If you can't submit the proof, send us an email:<a href="mailto:lmj.muginga@gmail.com"> LM-Ltd Team</a>.</small>
                </p>
              </div>
            </div>
          ) : (
            <div>Loading payment details ...</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeBankModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Schedule Modal */}
      <ScheduleServiceModal
        show={showScheduleModal}
        onHide={() => setShowScheduleModal(false)}
        service={selectedService}
        user={user}
        apiBaseUrl={apiBaseUrl}
        refresh={() => setRefreshKey((k) => k + 1)}
      />

      {/* Request Modal */}
      <RequestServiceModal
        show={showRequestModal}
        onHide={() => setShowRequestModal(false)}
        service={selectedService}
        user={user}
        apiBaseUrl={apiBaseUrl}
        refresh={() => setRefreshKey((k) => k + 1)}
      />

      {/* Upload Proof Modal expects a service id */}
      <UploadProofModal
        show={showUploadProofModal}
        onHide={() => {
          setShowUploadProofModal(false);
          setSelectedServiceForProof(null);
        }}
        serviceId={selectedServiceForProof}
      />

      <footer className="text-center py-4 border-top">
        <small>
          <p>
            <strong>{t("whoWeAre.footer.phones")} :</strong> (+244) 222 022 351;
            (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046
            <br />
            {t("whoWeAre.footer.address")}
          </p>
          &copy; {new Date().getFullYear()} {t("lmLtd")}{" "}
          {t("whoWeAre.footer.copyright")}
        </small>
      </footer>
    </>
  );
}