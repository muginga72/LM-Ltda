import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UploadDocumentModal from "../components/UploadDocumentModal";
import EmailSupportModal from "../components/EmailSupportModal";
import { AuthContext } from "../contexts/AuthContext";
import { Container, Spinner, Alert, Button, Modal, Card, Row, Col } from "react-bootstrap";
import UserDashboard from "../components/UserDashboard";

function UserOnlyDashboard({ apiBaseUrl, token, initialServices, onProofSubmitted, onServiceSelect }) {
  const { user } = useContext(AuthContext);

  const [requestedServices, setRequestedServices] = useState([]);
  const [scheduledServices, setScheduledServices] = useState([]);
  const [sharedServices, setSharedServices] = useState([]);
  const [paidServices, setPaidServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorRequested, setErrorRequested] = useState("");
  const [errorScheduled, setErrorScheduled] = useState("");
  const [errorShared, setErrorShared] = useState("");
  const [errorPaid, setErrorPaid] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  // const [uploadServiceId, setUploadServiceId] = useState(null);
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
        setErrorRequested("Failed to load requested services.");
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
        setErrorScheduled("Failed to load scheduled services.");
      }
    };

    const fetchShared = async () => {
      try {
        const res = await axios.get("/api/shares", { headers });
        const filtered = res.data.filter((item) => item.email === user.email);
        setSharedServices(filtered);
      } catch (err) {
        console.error("Shared services error:", err);
        setErrorShared("Failed to load shared services.");
      }
    };

    const fetchPaid = async () => {
      try {
        const base = (apiBaseUrl || "").replace(/\/+$/, ""); // remove trailing slash
        const url = `${base}/api/payments/paid-services`;

        const res = await axios.get(url, { headers });

        const all = Array.isArray(res.data) ? res.data : [];

        const filtered = user?.email
          ? all.filter((item) => item.payerEmail === user.email)
          : [];

        setPaidServices(filtered);
      } catch (err) {
        console.error("Paid services error:", err);
        setErrorPaid("Failed to load paid services.");
      }
    };

    Promise.all([
      fetchRequested(),
      fetchScheduled(),
      fetchShared(),
      fetchPaid(),
    ]).finally(() => setLoading(false));
  }, [user, apiBaseUrl]);

  const renderServiceCards = (title, services, error, type) => (
    <>
      <h5 className="mt-4 mb-3">{title}</h5>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : services.length === 0 ? (
        <Alert variant="info">No {type} services found.</Alert>
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
                      <Card.Text>{item.details || item.date || "—"}</Card.Text>
                      <Card.Text>
                        <small className="text-muted">
                          Created:{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </small>
                      </Card.Text>
                      <div className="mt-auto">
                        {item.paid ? (
                          <Button variant="success" disabled>
                            Paid
                          </Button>
                        ) : (
                          <Button
                            variant="outline-primary"
                            onClick={() => handlePayClick(item._id)}
                          >
                            Pay Instructions
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
                          // src={`${item.imagePath}`} // Source of error: Assuming imagePath is a full URL
                          src="/api/requests/uploads/default.png"
                          // alt={item.serviceTitle}  // Source of error: Assuming imagePath is a full URL
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
                          No image available
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
          Access denied. This dashboard is for regular users only.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container style={{ padding: "2rem" }}>
        <h2 className="mb-2 text-center">User Dashboard</h2>
        <h5 className="text-center mb-4">Welcome, {user.fullName}</h5>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>

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

        {/* 
          This section renders the Requests, Schedules, Shares, and Paid Services for the USER 
        */}
        <h4 className="mb-3 text-center">Your Service Overview</h4>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {renderServiceCards(
              "📝 Requested Services",
              requestedServices,
              errorRequested,
              "requested"
            )}
            {renderServiceCards(
              "📅 Scheduled Services",
              scheduledServices,
              errorScheduled,
              "scheduled"
            )}
            {renderServiceCards(
              "💳 Paid Services",
              paidServices,
              errorPaid,
              "paid"
            )}
            {renderServiceCards(
              "📧 Shared Services",
              sharedServices,
              errorShared,
              "shared"
            )}
          </>
        )}
      </Container>

      <hr />

      {/* ---------------------------  FOOTER  ---------------------------- */}
      <footer className="text-center py-1">
        <small>
          &copy; {new Date().getFullYear()} LM Ltd. All rights reserved.
        </small>
      </footer>

      {/* Payment Instructions Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please pay using the bank details below by deposit or transfer:</p>
          <ul>
            <li>
              <strong>Bank Name:</strong> BFA
            </li>
            <li>
              <strong>Account Name:</strong> Maria Miguel
            </li>
            <li>
              <strong>Account Number:</strong> 342295560 30 001
            </li>
            <li>
              <strong>Routing Number:</strong> AO06 0006 0000 42295560301 25
            </li>
            <li>
              <strong>Customer Name:</strong> Your full name or service ID
            </li>
          </ul>
          <hr />
          <p>
            Once you've completed the payment, please upload the support
            document or send it via email to confirm "SEND PAYMENT PROOF"
            button.
          </p>
          {/* <div className="d-flex justify-content-between mt-3">
            <Button
              variant="outline-primary"
              onClick={() => {
                setUploadServiceId(selectedServiceId);
                setShowUploadModal(true);
              }}
            >
              Upload Document
            </Button>
            <Button
              variant="outline-success"
              onClick={() => setEmailSupportModal(true)}
            >
              Send Email
            </Button>
          </div> */}
        </Modal.Body>

        <UploadDocumentModal
          show={showUploadModal}
          handleClose={() => setShowUploadModal(false)}
          // serviceId={uploadServiceId}
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