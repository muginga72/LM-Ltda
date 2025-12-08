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

/**
 * BookingForm component (embedded)
 *
 * Props:
 * - show: boolean
 * - onHide: function
 * - room: object { _id or id, name }
 * - userId: string (required)
 * - token: optional auth token
 * - apiBaseUrl: optional base URL (e.g., "http://localhost:5000")
 */
function BookingForm({ show, onHide, room, userId, token, apiBaseUrl = "" }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!show) {
      setStartDate("");
      setEndDate("");
      setGuestsCount(1);
      setSelectedFile(null);
      setError("");
      setLoading(false);
    }
  }, [show]);

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
    if (s > e) {
      setError("Start date must be before or equal to end date.");
      return false;
    }
    if (!Number.isInteger(Number(guestsCount)) || Number(guestsCount) < 1) {
      setError("Guests must be a positive integer.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    const roomId = room._id || room.id;
    const base = apiBaseUrl ? apiBaseUrl.replace(/\/$/, "") : "";
    const url = base ? `${base}/api/bookings` : "/api/bookings";

    try {
      setLoading(true);

      // If a file is selected, send multipart/form-data
      if (selectedFile) {
        const formData = new FormData();
        formData.append("roomId", roomId);
        formData.append("userId", userId);
        formData.append("startDate", startDate); // send as YYYY-MM-DD
        formData.append("endDate", endDate);
        formData.append("guestsCount", String(guestsCount));
        formData.append("idDocument", selectedFile);

        // Let browser set Content-Type (boundary)
        const headers = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        // Use fetch to allow browser-managed multipart header
        const res = await fetch(url, {
          method: "POST",
          headers,
          body: formData,
        });

        const body = await parseServerResponse(res);
        if (!res.ok) {
          const msg = (body && (body.message || body.error)) || `Server responded with ${res.status}`;
          throw new Error(msg);
        }

        onHide();
        return;
      }

      // No file: send JSON
      const payload = {
        roomId,
        userId,
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
        const msg = (body && (body.message || body.error)) || `Server responded with ${res.status}`;
        throw new Error(msg);
      }

      onHide();
    } catch (err) {
      console.error("Booking failed:", err);
      setError(err.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={() => { if (!loading) onHide(); }} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Book {room?.name || "Room"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

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
              onChange={(e) => setGuestsCount(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="bookingIdDocument">
            <Form.Label>ID Document (optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
            {selectedFile && (
              <div className="mt-2">
                <small>Selected file: <strong>{selectedFile.name}</strong></small>
              </div>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => { if (!loading) onHide(); }} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Confirm Booking"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

/**
 * NewAdminDashboard main component
 *
 * Props:
 * - apiBaseUrl: optional base URL for API (e.g., "http://localhost:5000")
 * - isAdmin: boolean
 * - token: optional token prop (fallback)
 * - userId: optional user id prop (fallback)
 */
function NewAdminDashboard({ apiBaseUrl = "", isAdmin, token: propToken, userId: propUserId }) {
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
                  <Nav.Link eventKey="bookings">Bookings</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>

            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <div className="mb-4">
                    <h4>Overview</h4>
                    <p className="text-muted">Quick stats and admin shortcuts.</p>
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
                              // Open booking modal so admin can choose dates and optionally upload ID
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
                        <h3 className="mb-3 text-center">{t("dashboardPreview")}</h3>
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
                  <RoomManager currentUser={user} token={token} onCreated={handleRoomCreated} />
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
                </Tab.Pane>

                <Tab.Pane eventKey="bookings">
                  <h5>Bookings</h5>
                  <p className="text-muted">List all bookings made by the users.</p>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>

        <hr />
        <CustomerMessages />
        <hr />

        <AdminDashboard
          apiBaseUrl={apiBaseUrl}
          isAdmin={isAdmin}
          token={token}
          onServiceUpdate={(service) => console.log("Service updated", service)}
          onPaymentUpdate={(payment) => console.log("Payment updated", payment)}
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

        <h4 className="m-3 text-center">{t("dashboardOverview")}</h4>

        {user?.role === "admin" && (
          <>
            {errorUsers && <Alert variant="danger">{errorUsers}</Alert>}
            <AdminUserTable users={users} />
          </>
        )}

        {errorRequested && <Alert variant="danger">{errorRequested}</Alert>}
        <AdminRequestedServicesTable services={requestedServices} token={token} onStatusUpdate={handleStatusUpdate} />

        {errorScheduled && <Alert variant="danger">{errorScheduled}</Alert>}
        <AdminScheduledServicesTable services={scheduledServices} token={token} onStatusUpdate={handleStatusUpdate} />

        {errorShared && <Alert variant="danger">{errorShared}</Alert>}
        <AdminSharedServicesTable services={sharedServices} />
      </Container>

      {/* Add Room modal */}
      <Modal show={modalRoomOpen} onHide={() => setModalRoomOpen(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{"Admin Add Item" || "Add Item"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RoomManager currentUser={user} token={token} onCreated={handleRoomCreated} />
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
            <strong>{t("whoWeAre.footer.phones")}:</strong> (+244) 222 022 351; (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046
            <br />
            {t("whoWeAre.footer.address")}
          </p>
          &copy; {new Date().getFullYear()} LM-Ltd Services. {t("whoWeAre.footer.copyright")}
        </small>
      </footer>
    </>
  );
}

export default NewAdminDashboard;