import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import ProofAttachment from "./ProofAttachment";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState("");

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/services`);
      const fetched = Array.isArray(res.data) ? res.data : [];
      setServices(fetched);

      if (selectedService) {
        const stillExists = fetched.some((s) => s._id === selectedService._id);
        if (!stillExists) {
          setSelectedService(null);
          setPayments([]);
        }
      }
    } catch (e) {
      console.error("fetchServices error:", e);
    } finally {
      setLoading(false);
    }
  }, [selectedService]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const normalizePayments = (rawPayments = [], serviceId = null) =>
    rawPayments
      .filter(Boolean)
      .map((p) => {
        const referencesService =
          p.serviceId &&
          (typeof p.serviceId === "string"
            ? p.serviceId === serviceId
            : p.serviceId._id === serviceId);
        const safeStatus = referencesService ? p.status || "unpaid" : "unpaid";
        return { ...p, status: safeStatus };
      });

  const openService = async (s) => {
    setSelectedService(s);
    setLoading(true);
    try {
      const r = await axios.get(`${API}/api/services/${s._id}/payments`);
      const raw = Array.isArray(r.data) ? r.data : [];
      const normalized = normalizePayments(raw, s._id);
      setPayments(normalized);
    } catch (e) {
      console.error("openService error:", e);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (paymentId, type) => {
    if (!selectedService) {
      setActionStatus("No service selected");
      setTimeout(() => setActionStatus(""), 2000);
      return;
    }

    setActionStatus("Processing...");
    try {
      const res = await axios.patch(
        `${API}/api/services/${selectedService._id}/confirm-payment`,
        { paymentId, type, notify: true }
      );

      setActionStatus("Payment confirmed and user notified.");
      await fetchServices();

      const returnedService = res?.data?.service;
      if (returnedService && returnedService._id) {
        await openService(returnedService);
      } else {
        const stillExists = services.some((s) => s._id === selectedService._id);
        if (stillExists) {
          await openService(selectedService);
        } else {
          setSelectedService(null);
          setPayments([]);
        }
      }
    } catch (e) {
      console.error("confirmPayment error:", e);
      setActionStatus("Confirm failed");
    } finally {
      setTimeout(() => setActionStatus(""), 2000);
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="g-3">
          {/* Left Column: Service List */}
          <Col xs={12} md={6}>
            <h5 className="py-3">Payment Services</h5>
            <Table hover bordered size="sm" responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id}>
                    <td>{s.title}</td>
                    <td>${(s.price || 0).toFixed(2)}</td>
                    <td>{s.status}</td>
                    <td>
                      <Button size="sm" onClick={() => openService(s)}>
                        Open
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>

          {/* Right Column: Payments or Calendar */}
          <Col xs={12} md={6}>
            {selectedService ? (
              <>
                <h5 className="py-3">Payments for: {selectedService.title}</h5>
                {actionStatus && <Alert variant="info">{actionStatus}</Alert>}
                <Table size="sm" bordered responsive>
                  <thead>
                    <tr>
                      <th>Payer</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">No payments</td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <React.Fragment key={p._id || `${p.payerEmail}-${Math.random()}`}>
                          <tr>
                            <td>{p.payerName || "-"}</td>
                            <td>{p.payerEmail}</td>
                            <td>${(p.amountPaid || 0).toFixed(2)}</td>
                            <td className={
                              p.status === "paid_full" ? "text-success" :
                              p.status === "paid_half" ? "text-warning" :
                              p.status === "unpaid" ? "text-danger" : ""
                            }>
                              {p.status}
                            </td>
                            <td>
                              <Button
                                size="sm"
                                variant="success"
                                className="me-1 mb-2"
                                onClick={() => confirmPayment(p._id, "full")}
                                disabled={p.status === "paid_full"}
                              >
                                Confirm Full
                              </Button>
                              <Button
                                size="sm"
                                variant="warning"
                                onClick={() => confirmPayment(p._id, "half")}
                                disabled={p.status === "paid_half"}
                              >
                                Confirm Half
                              </Button>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="5">
                              <ProofAttachment filePath={p.proofPath} serviceTitle={selectedService.title} />
                            </td>
                          </tr>
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </Table>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedService(null);
                    setPayments([]);
                  }}
                >
                  Close
                </Button>
              </>
            ) : (
              <div className="text-muted py-5 text-center">
                <strong>Select a service to view payments</strong>
              </div>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
}

export default AdminDashboard;