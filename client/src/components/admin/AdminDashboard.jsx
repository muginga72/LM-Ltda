// client/src/components/admin/AdminDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ProofAttachment from "./ProofAttachment";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState("");

  const formatPrice = (value) => {
    if (value === null || value === undefined) return "";
    const locale = i18n.language || "en-US";
    const currency = locale.startsWith("pt")
      ? "AOA"
      : locale.startsWith("fr")
      ? "EUR"
      : "USD";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2
    }).format(Number(value));
  };

  const translateTitle = (rawTitle) =>
    t(`service.${rawTitle}.title`, { defaultValue: rawTitle });

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
        // ensure status is a stable backend key
        const rawStatus = p.status || "unpaid";
        const safeStatus = referencesService ? rawStatus : "unpaid";
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
      setActionStatus(t("dashboardActionStatusFailed"));
    } finally {
      setTimeout(() => setActionStatus(""), 2000);
    }
  };

  const statusKey = (rawStatus) => {
    if (!rawStatus) return "unpaid";
    const s = String(rawStatus).toLowerCase();
    if (s === "paid_full" || s === "paidinfull" || s === "paid-full" || s === "paid full")
      return "paid_full";
    if (s === "paid_half" || s === "partial" || s === "half_paid" || s === "paid-half")
      return "paid_half";
    if (s === "unpaid" || s === "pending" || s === "not_paid") return "unpaid";
    return "other";
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
            <h5 className="py-3">{t("dashboardTitle")}</h5>
            <Table hover bordered size="sm" responsive>
              <thead>
                <tr>
                  <th>{t("dashboardTableServiceTitle")}</th>
                  <th>{t("dashboardTablePrice")}</th>
                  <th>{t("dashboardStatusLabel")}</th>
                  <th>{t("dashboardTableActions")}</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id}>
                    <td>{translateTitle(s.title)}</td>
                    <td>{formatPrice(s.price ?? 0)}</td>
                    <td>{t(`dashboardStatus.${statusKey(s.status)}`)}</td>
                    <td>
                      <Button size="sm" onClick={() => openService(s)}>
                        {t("dashboardOpen")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>

          {/* Right Column: Payments */}
          <Col xs={12} md={6}>
            {selectedService ? (
              <>
                <h5 className="py-3">
                  {t("dashboardPaymentsFor")}: {translateTitle(selectedService.title)}
                </h5>
                {actionStatus && <Alert variant="info">{actionStatus}</Alert>}
                <Table size="sm" bordered responsive>
                  <thead>
                    <tr>
                      <th>{t("dashboardTablePayer")}</th>
                      <th>{t("dashboardTableEmail")}</th>
                      <th>{t("dashboardTableAmount")}</th>
                      <th>{t("dashboardStatusLabel")}</th>
                      <th>{t("dashboardTableActions")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          {t("dashboardNoPayments")}
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => {
                        const key = p._id || p.payerEmail || `${selectedService._id}-${Math.random()}`;
                        const raw = p.status;
                        const sKey = statusKey(raw);
                        const cssClass =
                          sKey === "paid_full"
                            ? "text-success"
                            : sKey === "paid_half"
                            ? "text-warning"
                            : sKey === "unpaid"
                            ? "text-danger"
                            : "";

                        return (
                          <React.Fragment key={key}>
                            <tr>
                              <td>{p.payerName || "-"}</td>
                              <td>{p.payerEmail || "-"}</td>
                              <td>{formatPrice(p.amountPaid ?? 0)}</td>
                              <td className={cssClass}>{t(`dashboardStatus.${sKey}`)}</td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="success"
                                  className="me-1 mb-2"
                                  onClick={() => confirmPayment(p._id, "full")}
                                  disabled={sKey === "paid_full"}
                                >
                                  {t("dashboardConfirm.full")}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="warning"
                                  onClick={() => confirmPayment(p._id, "half")}
                                  disabled={sKey === "paid_half" || sKey === "paid_full"}
                                >
                                  {t("dashboardConfirm.half")}
                                </Button>
                              </td>
                            </tr>

                            <tr>
                              <td colSpan="5">
                                <ProofAttachment
                                  filePath={p.proofPath}
                                  serviceTitle={selectedService.title}
                                />
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </Table>

                <Button
                  className="mt-3"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedService(null);
                    setPayments([]);
                  }}
                >
                  {t("dashboardClose")}
                </Button>
              </>
            ) : (
              <div className="text-muted py-5 text-center">
                <strong>{t("dashboardViewPayments")}</strong>
              </div>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
}

export default AdminDashboard;