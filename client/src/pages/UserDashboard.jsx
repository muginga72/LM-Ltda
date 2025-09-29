import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { Container, Table, Spinner, Alert, Badge } from "react-bootstrap";

function UserDashboard() {
  const { user } = useContext(AuthContext);

  const [requestedServices, setRequestedServices] = useState([]);
  const [scheduledServices, setScheduledServices] = useState([]);
  const [sharedServices, setSharedServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorRequested, setErrorRequested] = useState("");
  const [errorScheduled, setErrorScheduled] = useState("");
  const [errorShared, setErrorShared] = useState("");

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${user?.token}`,
      "Cache-Control": "no-cache",
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

    if (user?.token) {
      Promise.all([fetchRequested(), fetchScheduled(), fetchShared()]).finally(
        () => setLoading(false)
      );
    }
  }, [user]);

  const renderRequestedTable = () => (
    <>
      <h5 className="mt-4 mb-3">📝 Requested Services</h5>
      {errorRequested ? (
        <Alert variant="danger">{errorRequested}</Alert>
      ) : requestedServices.length === 0 ? (
        <Alert variant="info">No requested services available.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service Title</th>
              <th>Type</th>
              <th>Fullname</th>
              <th>Details</th>
              <th>Paid</th>
              <th>Requested On</th>
            </tr>
          </thead>
          <tbody>
            {requestedServices.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.serviceTitle}</td>
                <td>{item.serviceType}</td>
                <td>{item.fullName}</td>
                <td>{item.details || "—"}</td>
                <td>
                  <Badge bg={item.paid ? "success" : "secondary"}>
                    {item.paid ? "Paid" : "Unpaid"}
                  </Badge>
                </td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );

  const renderScheduledTable = () => (
    <>
      <h5 className="mt-4 mb-3">📅 Scheduled Services</h5>
      {errorScheduled ? (
        <Alert variant="danger">{errorScheduled}</Alert>
      ) : scheduledServices.length === 0 ? (
        <Alert variant="info">No scheduled services available.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service Title</th>
              <th>Type</th>
              <th>Fullname</th>
              <th>Date</th>
              <th>Time</th>
              <th>Scheduled On</th>
            </tr>
          </thead>
          <tbody>
            {scheduledServices.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.serviceTitle}</td>
                <td>{item.serviceType}</td>
                <td>{item.fullName}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );

  const renderSharedTable = () => (
    <>
      <h5 className="mt-4 mb-3">📧 Shared Services</h5>
      {errorShared ? (
        <Alert variant="danger">{errorShared}</Alert>
      ) : sharedServices.length === 0 ? (
        <Alert variant="info">No shared services available.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service Title</th>
              <th>Email</th>
              <th>Shared On</th>
            </tr>
          </thead>
          <tbody>
            {sharedServices.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.serviceTitle}</td>
                <td>{item.email}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );

  return (
    <>
      <Container style={{ padding: "2rem" }}>
        <h2 className="mb-4 text-center">Welcome, {user?.name}</h2>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
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
      <footer className="text-center py-2">
        <small>&copy; {new Date().getFullYear()} LM Ltd. All rights reserved.</small>
      </footer>
    </>
  );
}

export default UserDashboard;