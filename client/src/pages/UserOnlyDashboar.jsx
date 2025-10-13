import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UploadDocumentModal from "../components/UploadDocumentModal";
import EmailSupportModal from "../components/EmailSupportModal";
import { AuthContext } from "../contexts/AuthContext";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Button,
  Modal,
} from "react-bootstrap";

function UserOnlyDashboard() {
  const { user } = useContext(AuthContext);

  const [requestedServices, setRequestedServices] = useState([]);
  const [scheduledServices, setScheduledServices] = useState([]);
  const [sharedServices, setSharedServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorRequested, setErrorRequested] = useState("");
  const [errorScheduled, setErrorScheduled] = useState("");
  const [errorShared, setErrorShared] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadServiceId, setUploadServiceId] = useState(null);
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

    Promise.all([fetchRequested(), fetchScheduled(), fetchShared()]).finally(
      () => setLoading(false)
    );
  }, [user]);

  const renderRequestedTable = () => (
    <>
      <h5 className="mt-4 mb-3">📝 Your Requested Services</h5>
      {errorRequested ? (
        <Alert variant="danger">{errorRequested}</Alert>
      ) : requestedServices.length === 0 ? (
        <Alert variant="info">You have no requested services.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Service Title</th>
              <th>Type</th>
              <th>Details</th>
              <th>Requested On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requestedServices.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.serviceTitle}</td>
                <td>{item.serviceType}</td>
                <td>{item.details || "—"}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  {item.paid ? (
                    <Button variant="success" disabled>
                      Paid
                    </Button>
                  ) : (
                    <Button
                      variant="warning"
                      onClick={() => handlePayClick(item._id)}
                    >
                      Pay Now
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );

  const renderScheduledTable = () => (
    <>
      <h5 className="mt-4 mb-3">📅 Your Scheduled Services</h5>
      {errorScheduled ? (
        <Alert variant="danger">{errorScheduled}</Alert>
      ) : scheduledServices.length === 0 ? (
        <Alert variant="info">You have no scheduled services.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Service Title</th>
              <th>Type</th>
              <th>Date</th>
              <th>Time</th>
              <th>Scheduled On</th>
              <th>Status</th>
              {/* <th>Upload/Email</th> */}
            </tr>
          </thead>
          <tbody>
            {scheduledServices.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.serviceTitle}</td>
                <td>{item.serviceType}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  {item.paid ? (
                    <Button variant="success" disabled>
                      Paid
                    </Button>
                  ) : (
                    <Button
                      variant="warning"
                      onClick={() => handlePayClick(item._id)}
                    >
                      Pay Now
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );

  const renderSharedTable = () => (
    <>
      <h5 className="mt-4 mb-3">📧 Your Shared Services</h5>
      {errorShared ? (
        <Alert variant="danger">{errorShared}</Alert>
      ) : sharedServices.length === 0 ? (
        <Alert variant="info">You have no shared services.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Service Title</th>
              <th>Fullname</th>
              <th>Email</th>
              <th>Shared On</th>
            </tr>
          </thead>
          <tbody>
            {sharedServices.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.serviceTitle}</td>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
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
        <h4 className="mb-3 text-center">Your Service Overview</h4>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {renderRequestedTable()}
            {renderScheduledTable()}
            {renderSharedTable()}
          </>
        )}
        <hr />
      </Container>

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
            document or send it via email to confirm.
          </p>
          <div className="d-flex justify-content-between mt-3">
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
          </div>
        </Modal.Body>

        <UploadDocumentModal
          show={showUploadModal}
          handleClose={() => setShowUploadModal(false)}
          serviceId={uploadServiceId}
          user={user}
        />

        <EmailSupportModal
          show={emailSupportModal}
          handleClose={() => setEmailSupportModal(false)}
          userEmail={user?.email}
          serviceId={selectedServiceId}
        />
      </Modal>

      <footer className="text-center py-2">
        <small>
          <p>
            Rua do Sapsapeiro F-7A, Sapú 2, Luanda, Angola <br/>
            Tel. : (+244) 222 022 351; (+244) 975 957 847
          </p>
          &copy; {new Date().getFullYear()} LM Ltd. All rights reserved.
        </small>
      </footer>
    </>
  );
}

export default UserOnlyDashboard;
