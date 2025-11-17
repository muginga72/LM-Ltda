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
} from "react-bootstrap";
import UserDashboard from "../components/UserDashboard";
import ServiceCalendar from "../components/ServiceCalendar";
import UserCalendar from "../components/UserCalendar";
import { useTranslation } from "react-i18next";

function UserOnlyDashboard({
  apiBaseUrl,
  token,
  initialServices,
  onProofSubmitted,
  onServiceSelect,
  userId,
  headers,
}) {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  const [requestedServices, setRequestedServices] = useState([]);
  const [scheduledServices, setScheduledServices] = useState([]);
  const [sharedServices, setSharedServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorRequested, setErrorRequested] = useState("");
  const [errorScheduled, setErrorScheduled] = useState("");
  const [errorShared, setErrorShared] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [emailSupportModal, setEmailSupportModal] = useState(false);

  const handlePayClick = (serviceId) => {
    setSelectedServiceId(serviceId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedServiceId(null);
  };

  useEffect(() => {
    if (!user || user.role === "admin") return;

    const headers = {
      Authorization: `Bearer ${user.token}`,
      "Cache-Control": "no-cache",
    };

    const fetchRequested = async () => {
      try {
        const res = await axios.get("/api/requests", { headers });
        const filtered = res.data.filter(
          (item) => item.email === user.email || item.fullName === user.fullName
        );
        setRequestedServices(filtered);
      } catch (err) {
        console.error("Requested services error:", err);
        setErrorRequested(t("dashboard.failedRequested"));
      }
    };

    const fetchScheduled = async () => {
      try {
        const res = await axios.get("/api/schedules", { headers });
        const filtered = res.data.filter(
          (item) => item.fullName === user.fullName
        );
        setScheduledServices(filtered);
      } catch (err) {
        console.error("Scheduled services error:", err);
        setErrorScheduled(t("dashboard.failedScheduled"));
      }
    };

    const fetchShared = async () => {
      try {
        const res = await axios.get("/api/shares", { headers });
        const filtered = res.data.filter((item) => item.email === user.email);
        setSharedServices(filtered);
      } catch (err) {
        console.error("Shared services error:", err);
        setErrorShared(t("dashboard.failedShared"));
      }
    };

    Promise.all([fetchRequested(), fetchScheduled(), fetchShared()]).finally(
      () => setLoading(false)
    );
  }, [user, apiBaseUrl, t]);

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
                            onClick={() => handlePayClick(item._id)}
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
                          src="/api/requests/uploads/default.png"
                          alt="Default"
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

  if (!user || user.role === "admin") {
    return (
      <Container style={{ padding: "2rem" }}>
        <Alert variant="warning" className="text-center">
          {t("dashboard.accessDenied")}
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
        <p>
          {t("dashboard.email")}: {user.email}
        </p>
        <p>
          {t("dashboard.role")}: {user.role}
        </p>

        <hr />

        <UserDashboard
          apiBaseUrl={apiBaseUrl}
          user={user}
          token={token}
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
        <h4 className="mb-3 text-center">{t("dashboard.overview")}</h4>
        {loading ? (
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
      </Container>

      <hr />

      {/* ---------------------------  FOOTER  ---------------------------- */}
      <footer className="text-center py-1">
        <small>
          &copy; {new Date().getFullYear()} {t("lmLtd")}. {t("footer.rights")}
        </small>
      </footer>

      {/* Payment Instructions Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("modal.paymentInstructions.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("modal.paymentInstructions.intro")}</p>
          <ul>
            <li>
              <strong>{t("modal.paymentInstructions.bankName")}:</strong> BFA
            </li>
            <li>
              <strong>{t("modal.paymentInstructions.accountName")}:</strong>{" "}
              Maria Miguel
            </li>
            <li>
              <strong>{t("modal.paymentInstructions.accountNumber")}:</strong>{" "}
              342295560 30 001
            </li>
            <li>
              <strong>{t("modal.paymentInstructions.routingNumber")}:</strong>{" "}
              AO06 0006 0000 42295560301 25
            </li>
            <li>
              <strong>{t("modal.paymentInstructions.customerName")}:</strong>{" "}
              {t("fullNameId")}
            </li>
          </ul>
          <hr />
          <p>{t("modal.paymentInstructions.footer")}</p>
        </Modal.Body>

        <UploadDocumentModal
          show={showUploadModal}
          handleClose={() => setShowUploadModal(false)}
          user={user}
        />
        <EmailSupportModal
          show={emailSupportModal}
          handleClose={() => setEmailSupportModal(false)}
          userEmail={user?.email}
          serviceId={selectedServiceId}
        />
      </Modal>
    </>
  );
}

export default UserOnlyDashboard;