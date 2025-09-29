import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { Container, Table, Spinner, Alert, Badge } from "react-bootstrap";

function UserDashboard() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [scheduledRequests, setScheduledRequests] = useState([]);
  const [pastRequests, setPastRequests] = useState([]);
  const [scheduledServices, setScheduledServices] = useState([]);
  const [pastServices, setPastServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, schedRes] = await Promise.all([
          axios.get("/api/user/requests", {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          axios.get("/api/user/schedules", {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
        ]);

        setRequests(reqRes.data.requests || []);
        setScheduledRequests(reqRes.data.scheduled || []);
        setPastRequests(reqRes.data.past || []);
        setScheduledServices(schedRes.data.scheduled || []);
        setPastServices(schedRes.data.past || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load your service data.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchData();
  }, [user]);

  const renderStatusBadge = (status) => {
    const variantMap = {
      pending: "warning",
      confirmed: "primary",
      completed: "success",
      cancelled: "danger",
      expired: "secondary",
    };
    const variant = variantMap[status?.toLowerCase()] || "dark";
    return (
      <Badge bg={variant} className="text-capitalize">
        {status}
      </Badge>
    );
  };

  const renderTable = (title, data, dateField = "createdAt") => (
    <>
      <h5 className="mt-4 mb-3">{title}</h5>
      {data.length === 0 ? (
        <Alert variant="info">No {title.toLowerCase()} available.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              <th>Status</th>
              <th>
                {dateField === "scheduledFor" ? "Scheduled Date" : "Requested On"}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.serviceName || item.serviceTitle}</td>
                <td>{renderStatusBadge(item.status)}</td>
                <td>
                  {item[dateField]
                    ? new Date(item[dateField]).toLocaleDateString()
                    : "—"}
                </td>
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
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            {renderTable("Requested Services", requests)}
            {renderTable("Scheduled Requests", scheduledRequests, "scheduledFor")}
            {renderTable("Past Requests", pastRequests, "scheduledFor")}
            {renderTable("Scheduled Services", scheduledServices, "scheduledFor")}
            {renderTable("Past Services", pastServices, "scheduledFor")}
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