// src/components/AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
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

      // If selectedService was removed server-side, clear selection
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
          (typeof p.serviceId === "string" ? p.serviceId === serviceId : p.serviceId._id === serviceId);

        const safeStatus = referencesService ? p.status || "unpaid" : "unpaid";

        return {
          ...p,
          status: safeStatus,
        };
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

      // Refresh services then payments defensively
      await fetchServices();

      const returnedService = res?.data?.service;
      if (returnedService && returnedService._id) {
        await openService(returnedService);
      } else {
        // re-open selectedService if still exists
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
    <>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <h5 className="py-4">Payment Services</h5>
            <Table hover bordered size="sm">
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
          </div>

          <div className="col-md-6">
            {selectedService ? (
              <>
                <h5>Payments for: {selectedService.title}</h5>
                {actionStatus && <Alert variant="info">{actionStatus}</Alert>}
                <Table size="sm" bordered>
                  <thead>
                    <tr>
                      <th>Payer</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Status</th>
                      {/* <th>Proof</th> */}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No payments
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <React.Fragment key={p._id || `${p.payerEmail}-${Math.random()}`}>
                          <tr>
                            <td>{p.payerName || "-"}</td>
                            <td>{p.payerEmail}</td>
                            <td>${(p.amountPaid || 0).toFixed(2)}</td>
                            <td
                              className={
                                p.status === "paid_full"
                                  ? "text-success"
                                  : p.status === "paid_half"
                                  ? "text-warning"
                                  : p.status === "unpaid"
                                  ? "text-danger"
                                  : ""
                              }
                            >
                              {p.status}
                            </td>
                            {/* <td>
                              {p.proofPath ? (
                                <a href={p.proofPath} target="_blank" rel="noreferrer">
                                  View
                                </a>
                              ) : (
                                "-"
                              )}
                            </td> */}
                            <td>
                              <Button
                                size="sm"
                                variant="success"
                                className="me-1"
                                onClick={() => confirmPayment(p._id, "full")}
                                disabled={p.status === "paid_full"}
                              >
                                Confirm Full
                              </Button>
                              <Button
                                size="sm"
                                variant="warning"
                                onClick={() => confirmPayment(p._1d, "half")}
                                disabled={p.status === "paid_half"}
                              >
                                Confirm Half
                              </Button>
                            </td>
                          </tr>

                          <tr>
                            <td colSpan="6">
                              <ProofAttachment filePath={p.proofPath} serviceTitle={selectedService.title} />
                            </td>
                          </tr>
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </Table>

                <Button variant="secondary" size="sm" onClick={() => { setSelectedService(null); setPayments([]); }}>
                  Close
                </Button>
              </>
            ) : (
              <div className="text-muted py-4"><strong>Select a service to view payments</strong></div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;