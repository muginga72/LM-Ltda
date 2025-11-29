// src/pages/NewAdminDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
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
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

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
import RoomList from "../components/roomrentals/RoomList.jsx";

function NewAdminDashboard({ apiBaseUrl, isAdmin, token: propToken, userId }) {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const token = user?.token || propToken;

  const [users, setUsers] = useState([]);
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
    fetchServices()
      .then(setServices)
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

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

  // called when AddRoomForm successfully creates a room
  const handleRoomCreated = (newRoom) => {
    setModalRoomOpen(false);
    setRefreshKey((k) => k + 1);
    alert("Room created successfully");
    console.log("Room created", newRoom);
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

        {/* --------- Do Not Remove It ------------- */}
        <Container className="py-2">
          <AdminAddService
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
            onCreated={handleServiceCreated}
            token={token}
          />
        </Container>

        {/* Tabs: Overview / Rooms / Services / Settings */}
        <Tab.Container defaultActiveKey="overview">
          <Card>
            <Card.Header>
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="overview">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="rooms">Rooms</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="services">Services</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="settings">Settings</Nav.Link>
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
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 style={{ margin: 0 }}>Manage Rooms</h4>
                      <p className="text-muted mb-0">
                        Create, edit and remove rooms. Admin access required.
                      </p>
                    </div>
                    <div>
                      <Button
                        variant="primary"
                        onClick={() => setModalRoomOpen(true)}
                      >
                        Add Room
                      </Button>
                    </div>
                  </div>

                  {/* AddRoomManager handles listing, creating and refreshing rooms */}
                  <RoomManager
                    currentUser={user}
                    token={token}
                    onCreated={handleRoomCreated}
                  />

                  {/* RoomList for a simple listing (kept for compatibility) */}
                  <div className="mt-4">
                    <RoomList refreshKey={refreshKey} />
                  </div>
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

                <Tab.Pane eventKey="settings">
                  <h5>Settings</h5>
                  <p className="text-muted">
                    Admin settings and configuration.
                  </p>
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
                  <ServiceCalendar userId={userId} />
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
        <AdminRequestedServicesTable
          services={requestedServices}
          token={token}
          onStatusUpdate={handleStatusUpdate}
        />

        {errorScheduled && <Alert variant="danger">{errorScheduled}</Alert>}
        <AdminScheduledServicesTable
          services={scheduledServices}
          token={token}
          onStatusUpdate={handleStatusUpdate}
        />

        {errorShared && <Alert variant="danger">{errorShared}</Alert>}
        <AdminSharedServicesTable services={sharedServices} />
      </Container>

      {/*---- Modal used for Add Room / Add Service actions -----*/}
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

      <footer className="text-center py-4 border-top">
        <small>
          <p>
            <strong>{t("whoWeAre.footer.phones")}:</strong>{" "}
            (+244) 222 022 351; (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046
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