// client/src/pages/NewAdminDashboard.jsx

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import AdminUserTable from "../components/admin/adminTables/AdminUserTable";
import AdminRequestedServicesTable from "../components/admin/adminTables/AdminRequestedServicesTable.jsx";
import AdminScheduledServicesTable from "../components/admin/adminTables/AdminScheduledServicesTable.jsx";
import AdminSharedServicesTable from "../components/admin/adminTables/AdminSharedServicesTable.jsx";
import { Container, Spinner, Alert, Button, Col, Row } from "react-bootstrap";
import AdminAddService from "../components/admin/AdminAddService";
import ServicesGrid from "../components/ServicesGrid";
import { fetchServices } from "../api/servicesApi";
import AdminDashboard from "../components/admin/AdminDashboard.jsx";
import AdminScheduleForm from "../components/admin/AdminScheduleForm.jsx";
import ServiceCalendar from "../components/ServiceCalendar.jsx";
import { useTranslation } from "react-i18next";
import CustomerMessages from "../components/CustomerMessages.jsx";

function NewAdminDashboard({ apiBaseUrl, isAdmin, token, userId }) {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

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

  useEffect(() => {
    if (!user?.token) return;
    const headers = {
      Authorization: `Bearer ${user.token}`,
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
      if (user.role === "admin") promises.unshift(fetchUsers());
      await Promise.all(promises);
      setLoading(false);
    };

    fetchAll();
  }, [user]);

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
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Button
              variant="outline-success"
              onClick={() => setShowAddModal(true)}
            >
              {t("adminAddService")}
            </Button>
          </div>

          <AdminAddService
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
            onCreated={handleServiceCreated}
            token={token}
          />
          <hr />
        </Container>

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
            {/* Form column: 40% on md+, full width on small */}
            <Col xs={12} md={5} className="admin-form-col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <AdminScheduleForm />
                </div>
              </div>
            </Col>

            {/* Calendar column: 60% on md+, full width on small */}
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

        {user?.role === t("adminRole") && (
          <>
            {errorUsers && <Alert variant="danger">{errorUsers}</Alert>}
            <AdminUserTable users={users} />
          </>
        )}

        {errorRequested && <Alert variant="danger">{errorRequested}</Alert>}
        <AdminRequestedServicesTable
          services={requestedServices}
          token={user?.token}
          onStatusUpdate={handleStatusUpdate}
        />

        {errorScheduled && <Alert variant="danger">{errorScheduled}</Alert>}
        <AdminScheduledServicesTable
          services={scheduledServices}
          token={user?.token}
          onStatusUpdate={handleStatusUpdate}
        />

        {errorShared && <Alert variant="danger">{errorShared}</Alert>}
        <AdminSharedServicesTable services={sharedServices} />
      </Container>
      <hr />
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