// src/pages/NewAdminDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Container,
  Spinner,
  Alert,
  Button,
  Col,
  Row,
  Modal,
  Tab,
  Nav,
  Card,
  Form,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { AuthContext } from "../contexts/AuthContext";
import AdminAddService from "../components/admin/AdminAddService";
import ServicesGrid from "../components/ServicesGrid";
import { fetchServices } from "../api/servicesApi";
import AdminDashboard from "../components/admin/AdminDashboard.jsx";
import AdminScheduleForm from "../components/admin/AdminScheduleForm.jsx";
import ServiceCalendar from "../components/ServiceCalendar.jsx";
import CustomerMessages from "../components/CustomerMessages.jsx";
import AdminUserTable from "../components/admin/adminTables/AdminUserTable";
import AdminRequestedServicesTable from "../components/admin/adminTables/AdminRequestedServicesTable.jsx";
import AdminScheduledServicesTable from "../components/admin/adminTables/AdminScheduledServicesTable.jsx";
import AdminSharedServicesTable from "../components/admin/adminTables/AdminSharedServicesTable.jsx";

import RoomManager from "../components/roomrentals/RoomManager.jsx";
import RoomCardWithPay from "../components/roomrentals/RoomCardWithPay.jsx";
import AdminListBookings from "../components/admin/adminTables/AdminListBookings.jsx";

function BookingForm({
  show,
  onHide,
  room,
  userId,
  token,
  apiBaseUrl = "",
  onBooked = null,
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);

  // Personal / ID fields required by server model
  const [guestOneName, setGuestOneName] = useState("");
  const [guestOneEmail, setGuestOneEmail] = useState("");
  const [guestTwoName, setGuestTwoName] = useState("");
  const [guestTwoEmail, setGuestTwoEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!show) {
      // reset form when modal closes
      setStartDate("");
      setEndDate("");
      setGuestsCount(1);
      setGuestOneName("");
      setGuestOneEmail("");
      setGuestTwoName("");
      setGuestTwoEmail("");
      setGuestPhone("");
      setDateOfBirth("");
      setSelectedFile(null);
      setError("");
      setSuccessMsg("");
      setLoading(false);
    }
  }, [show]);

  // Basic client-side validation
  const validate = () => {
    setError("");
    const roomId = room?._id || room?.id;
    if (!roomId) {
      setError("No room selected.");
      return false;
    }
    if (!userId) {
      setError("No user id available. Please sign in.");
      return false;
    }
    if (!startDate || !endDate) {
      setError("Start date and end date are required.");
      return false;
    }
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      setError("Invalid date format.");
      return false;
    }
    if (s >= e) {
      setError("End date must be after start date.");
      return false;
    }
    if (!Number.isInteger(Number(guestsCount)) || Number(guestsCount) < 1) {
      setError("Guests must be a positive integer.");
      return false;
    }

    // Personal info checks required by server model
    if (!guestOneName || guestOneName.trim() === "") {
      setError("Guest name is required.");
      return false;
    }
    if (!dateOfBirth) {
      setError("Date of birth is required.");
      return false;
    }
    // basic age check (server also enforces >=18)
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      setError("Invalid date of birth.");
      return false;
    }
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const birthdayThisYear = new Date(
      today.getFullYear(),
      dob.getMonth(),
      dob.getDate()
    );
    if (today < birthdayThisYear) age--;
    if (age < 18) {
      setError("Guest must be at least 18 years old to book.");
      return false;
    }

    // If an ID file is selected, check size (10MB)
    if (selectedFile) {
      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError("ID file is too large. Maximum 10MB allowed.");
        return false;
      }
    }

    // basic email validation if provided
    if (guestOneEmail && !/^\S+@\S+\.\S+$/.test(guestOneEmail)) {
      setError("Guest #1 email is invalid.");
      return false;
    }
    if (guestTwoEmail && !/^\S+@\S+\.\S+$/.test(guestTwoEmail)) {
      setError("Guest #2 email is invalid.");
      return false;
    }

    return true;
  };

  const parseServerResponse = async (res) => {
    try {
      return await res.json();
    } catch {
      try {
        return await res.text();
      } catch {
        return null;
      }
    }
  };

  const buildUrl = (path) => {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    if (!apiBaseUrl) return normalized;
    const base = apiBaseUrl.replace(/\/+$/, "");
    return `${base}${normalized}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!validate()) return;

    const roomId = room?._id || room?.id;
    const url = buildUrl("/api/bookings");

    try {
      setLoading(true);

      // If a file is selected, send multipart/form-data
      if (selectedFile) {
        const formData = new FormData();
        // include both common keys server might expect
        formData.append("roomId", roomId);
        formData.append("room", roomId);
        formData.append("userId", userId);
        formData.append("guestOneName", guestOneName);
        formData.append("guestOneEmail", guestOneEmail || "");
        formData.append("guestTwoName", guestTwoName || "");
        formData.append("guestTwoEmail", guestTwoEmail || "");
        formData.append("guestPhone", guestPhone || "");
        formData.append("dateOfBirth", dateOfBirth);
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("guestsCount", String(guestsCount));
        formData.append("idDocument", selectedFile, selectedFile.name);

        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(url, {
          method: "POST",
          headers,
          body: formData,
        });

        const body = await parseServerResponse(res);
        if (!res.ok) {
          const msg =
            (body && (body.message || body.error)) ||
            `Server responded with ${res.status}`;
          throw new Error(msg);
        }

        setSuccessMsg("Booking created successfully.");
        onBooked && onBooked(body);
        onHide();
        return;
      }

      // No file: send JSON
      const payload = {
        roomId,
        room: roomId,
        userId,
        guestOneName,
        guestOneEmail: guestOneEmail || undefined,
        guestTwoName: guestTwoName || undefined,
        guestTwoEmail: guestTwoEmail || undefined,
        guestPhone: guestPhone || undefined,
        dateOfBirth,
        startDate,
        endDate,
        guestsCount: Number(guestsCount),
      };

      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const body = await parseServerResponse(res);
      if (!res.ok) {
        const msg =
          (body && (body.message || body.error)) ||
          `Server responded with ${res.status}`;
        throw new Error(msg);
      }

      setSuccessMsg("Booking created successfully.");
      onBooked && onBooked(body);
      onHide();
    } catch (err) {
      console.error("Booking failed:", err);
      setError(err.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        if (!loading) onHide();
      }}
      centered
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            Book {room?.roomTitle || room?.name || "Room"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMsg && <Alert variant="success">{successMsg}</Alert>}

          <Form.Group className="mb-3" controlId="bookingStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="bookingEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="bookingGuests">
            <Form.Label>Guests</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={guestsCount}
              onChange={(e) => setGuestsCount(Number(e.target.value) || 1)}
              disabled={loading}
            />
          </Form.Group>

          <hr />

          <Form.Group className="mb-3" controlId="guestOneName">
            <Form.Label>Guest Name</Form.Label>
            <Form.Control
              type="text"
              value={guestOneName}
              onChange={(e) => setGuestOneName(e.target.value)}
              required
              disabled={loading}
              placeholder="Your fullname"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="guestOneEmail">
            <Form.Label>Guest Email</Form.Label>
            <Form.Control
              type="email"
              value={guestOneEmail}
              onChange={(e) => setGuestOneEmail(e.target.value)}
              disabled={loading}
              placeholder="Your email address"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="guestTwoName">
            <Form.Label>Guest Name (optional)</Form.Label>
            <Form.Control
              type="text"
              value={guestTwoName}
              onChange={(e) => setGuestTwoName(e.target.value)}
              disabled={loading}
              placeholder="Second guest fullname"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="guestTwoEmail">
            <Form.Label>Guest Email (optional)</Form.Label>
            <Form.Control
              type="email"
              value={guestTwoEmail}
              onChange={(e) => setGuestTwoEmail(e.target.value)}
              disabled={loading}
              placeholder="Second guest email"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="guestPhone">
            <Form.Label>Guest phone</Form.Label>
            <Form.Control
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              disabled={loading}
              placeholder="Your phone number"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="dateOfBirth">
            <Form.Label>Date of birth</Form.Label>
            <Form.Control
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="bookingIdDocument">
            <Form.Label>ID Document (Recommended)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
            {selectedFile && (
              <div className="mt-2">
                <small>
                  Selected file: <strong>{selectedFile.name}</strong>
                </small>
              </div>
            )}
            <div className="text-muted mt-1" style={{ fontSize: 12 }}>
              Max 10MB. PDF or image formats accepted. Providing an ID speeds up
              booking approval.
            </div>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              if (!loading) onHide();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function NewAdminDashboard({
  apiBaseUrl = "",
  isAdmin,
  token: propToken,
  roomId,
  userId: propUserId,
  selectedRoomId = null,
}) {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const token = user?.token || propToken;
  const effectiveUserId = user?._id || propUserId || (user && user.id) || null;

  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  const [requestedServices, setRequestedServices] = useState([]);
  const [scheduledServices, setScheduledServices] = useState([]);
  const [sharedServices, setSharedServices] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorUsers, setErrorUsers] = useState("");
  const [errorRequested, setErrorRequested] = useState("");
  const [errorScheduled, setErrorScheduled] = useState("");
  const [errorShared, setErrorShared] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalRoomOpen, setModalRoomOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingRoom, setBookingRoom] = useState(null);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  useEffect(() => {
    if (!token) return;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users", { headers });
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setErrorUsers("Failed to load user list.");
      }
    };

    const fetchRequested = async () => {
      try {
        const res = await axios.get("/api/requests", { headers });
        setRequestedServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Requested services error:", err);
        setErrorRequested("Failed to load requested services.");
      }
    };

    const fetchScheduled = async () => {
      try {
        const res = await axios.get("/api/schedules", { headers });
        setScheduledServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Scheduled services error:", err);
        setErrorScheduled("Failed to load scheduled services.");
      }
    };

    const fetchShared = async () => {
      try {
        const res = await axios.get("/api/shares", { headers });
        setSharedServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Shared services error:", err);
        setErrorShared("Failed to load shared services.");
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      const promises = [fetchRequested(), fetchScheduled(), fetchShared()];
      if (user?.role === "admin") promises.unshift(fetchUsers());
      await Promise.all(promises);
      setLoading(false);
    };

    fetchAll();
  }, [user, token]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!token) {
        setRooms([]);
        setLoadingRooms(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const baseUrl = apiBaseUrl || "";
        const res = await axios.get(`${baseUrl}/api/rooms`, { headers });
        setRooms(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [token, apiBaseUrl, refreshKey]);

  const handleServiceCreated = () => {
    fetchServices()
      .then(setServices)
      .catch((err) => console.error("Error refreshing services:", err));
    setShowAddModal(false);
  };

  const handleStatusUpdate = (serviceId, newStatus, type) => {
    if (type === "requested") {
      setRequestedServices((prev) =>
        prev.map((s) => (s._id === serviceId ? { ...s, status: newStatus } : s))
      );
    } else if (type === "scheduled") {
      setScheduledServices((prev) =>
        prev.map((s) => (s._id === serviceId ? { ...s, status: newStatus } : s))
      );
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  const handleRoomCreated = (newRoom) => {
    setModalRoomOpen(false);
    setRefreshKey((k) => k + 1);
    alert("Room created successfully");
    console.log("Room created", newRoom);
  };

  // Open booking modal for a selected room
  const openBookingModal = (room) => {
    setBookingRoom(room);
    setBookingModalOpen(true);
  };

  return (
    <>
      <Container style={{ padding: "2rem" }}>
        <h2 className="mb-2 text-center">
          {user?.role === "admin" ? t("adminDashboardTitle") : "User Dashboard"}
        </h2>
        <h5 className="text-center mb-4">
          {t("welcomeUser")}, {user?.fullName}
        </h5>
        <p>Email: {user?.email}</p>
        <p>
          {t("adminRole")}: {user?.role}
        </p>

        <Container className="py-2">
          <AdminAddService
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
            onCreated={handleServiceCreated}
            token={token}
          />
        </Container>

        <Tab.Container defaultActiveKey="overview">
          <Card>
            <Card.Header>
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="overview">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="services">Services</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="rooms">Rooms</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="bookings">Bookings Panel</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>

            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <div className="mb-4">
                    <h4>Overview</h4>
                    <p className="text-muted">
                      Quick stats and admin shortcuts.
                    </p>
                  </div>

                  {loadingRooms ? (
                    <Spinner animation="border" />
                  ) : rooms.length > 0 ? (
                    <Row className="mb-4 gap-3">
                      {rooms.map((room, index) => (
                        <Col key={room._id || room.id || index} md={4}>
                          <RoomCardWithPay
                            room={room}
                            onRequestBooking={() => {
                              openBookingModal(room);
                            }}
                          />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Alert variant="info">No rooms available</Alert>
                  )}

                  <div className="container py-3">
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <h3 className="mb-3 text-center">
                          {t("dashboardPreview")}
                        </h3>
                        {services.length === 0 ? (
                          <Alert variant="info">{t("admiNoServices")}</Alert>
                        ) : (
                          <ServicesGrid services={services} />
                        )}
                      </div>
                    </div>
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="rooms">
                  <RoomManager
                    currentUser={user}
                    token={token}
                    onCreated={handleRoomCreated}
                  />
                </Tab.Pane>

                <Tab.Pane eventKey="bookings">
                  <AdminListBookings
                    apiBaseUrl={apiBaseUrl}
                    token={token}
                    useCookies={true}
                  />
                </Tab.Pane>

                <Tab.Pane eventKey="services">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5>Manage Services</h5>
                      <p className="text-muted">Create and manage services.</p>
                    </div>

                    <Button
                      variant="outline-success"
                      onClick={() => setShowAddModal(true)}
                      style={{ marginRight: 20 }}
                    >
                      {t("adminAddService")}
                    </Button>
                  </div>

                  <div className="mt-3">
                    <ServicesGrid services={services} />
                  </div>

                  <AdminDashboard
                    apiBaseUrl={apiBaseUrl}
                    isAdmin={isAdmin}
                    token={token}
                    onServiceUpdate={(service) =>
                      console.log("Service updated", service)
                    }
                    onPaymentUpdate={(payment) =>
                      console.log("Payment updated", payment)
                    }
                  />

                  <hr />

                  <div className="admin-dashboard-wrapper">
                    <Row className="g-3 align-items-start">
                      <Col xs={12} md={5} className="admin-form-col">
                        <div className="card h-100 shadow-sm">
                          <div className="card-body">
                            <AdminScheduleForm />
                          </div>
                        </div>
                      </Col>

                      <Col xs={12} md={7} className="admin-calendar-col">
                        <div className="card h-100 shadow-sm">
                          <div className="card-body calendar-card-body">
                            <ServiceCalendar userId={effectiveUserId} />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <hr />

                  {user?.role === "admin" && (
                    <>
                      {errorUsers && (
                        <Alert variant="danger">{errorUsers}</Alert>
                      )}
                      <AdminUserTable users={users} />
                    </>
                  )}

                  {/* ------- This section is customer messaging -------- */}
                  <CustomerMessages /> 

                  {errorRequested && (
                    <Alert variant="danger">{errorRequested}</Alert>
                  )}
                  <AdminRequestedServicesTable
                    services={requestedServices}
                    token={token}
                    onStatusUpdate={handleStatusUpdate}
                  />

                  {errorScheduled && (
                    <Alert variant="danger">{errorScheduled}</Alert>
                  )}
                  <AdminScheduledServicesTable
                    services={scheduledServices}
                    token={token}
                    onStatusUpdate={handleStatusUpdate}
                  />

                  {errorShared && <Alert variant="danger">{errorShared}</Alert>}
                  <AdminSharedServicesTable services={sharedServices} />
                </Tab.Pane>

                <Tab.Pane
                  eventKey="bookings"
                  style={{ height: "100%", overflow: "hidden" }}
                >
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>
      </Container>

      {/* Add Room modal */}
      <Modal
        show={modalRoomOpen}
        onHide={() => setModalRoomOpen(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{"Admin Add Item" || "Add Item"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RoomManager
            currentUser={user}
            token={token}
            onCreated={handleRoomCreated}
          />
        </Modal.Body>
      </Modal>

      {/* Booking modal */}
      <BookingForm
        show={bookingModalOpen}
        onHide={() => setBookingModalOpen(false)}
        room={bookingRoom}
        userId={effectiveUserId}
        token={token}
        apiBaseUrl={apiBaseUrl}
      />

      <footer className="text-center py-4 border-top">
        <small>
          <p>
            <strong>{t("whoWeAre.footer.phones")}:</strong> (+244) 222 022 351;
            (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046
            <br />
            {t("whoWeAre.footer.address")}
          </p>
          &copy; {new Date().getFullYear()} LM-Ltd Services.{" "}
          {t("whoWeAre.footer.copyright")}
        </small>
      </footer>
    </>
  );
}

export default NewAdminDashboard;