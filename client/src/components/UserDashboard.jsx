// components/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UploadProofModal from "./UploadProofModal";
import ProofAttachment from "./admin/ProofAttachment";
import PaymentModal from "./PaymentModal";
import PayInstructionsModal from "./PayInstructionsModal";
import { useTranslation } from "react-i18next";

function UserDashboard({ apiBaseUrl, user, userPayment }) {
  const { t, i18n } = useTranslation();
  const API = apiBaseUrl || process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);

  // Payment modal state
  const [showPayment, setShowPayment] = useState(false);
  const [paymentService, setPaymentService] = useState(null);

  // Pay instructions modal state
  const [showInstructions, setShowInstructions] = useState(false);
  const [bankInfo, setBankInfo] = useState(null);

  // Upload proof modal state
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`${API}/api/services`)
      .then((r) => setServices(r.data))
      .catch(console.error);
  }, [API, user]);

  const refreshServices = () => {
    axios
      .get(`${API}/api/services`)
      .then((r) => setServices(r.data))
      .catch(console.error);
  };

  const relevantServices = services.filter(
    (s) =>
      s.requestedBy === user?.id ||
      s.scheduledFor === user?.id ||
      (Array.isArray(s.sharedWith) && s.sharedWith.includes(user?.id))
  );

  const formatPrice = (value) => {
    if (value === undefined || value === null) return "";
    const locale = i18n.language || "en-US";
    const currency = locale.startsWith("pt") ? "AOA" : locale.startsWith("fr") ? "EUR" : "USD";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(value));
  };

  const translateTitle = (rawTitle) => t(`service.${rawTitle}.title`, { defaultValue: rawTitle });

  const translateDescription = (rawTitle, rawDescription) =>
    t(`service.${rawTitle}.description`, { defaultValue: rawDescription });

  const handleOpenPayment = (service) => {
    setPaymentService(service);
    setShowPayment(true);
  };

  const handlePaid = () => {
    refreshServices();
  };

  const handleShowPayInstructions = (info) => {
    setBankInfo(info);
    setShowInstructions(true);
    setShowUpload(true);
    setSelected(info.service);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{t("dashboard.availableServices")}</h3>
      </div>

      {relevantServices.length === 0 ? (
        <div className="alert alert-info">{t("dashboard.noServices")}</div>
      ) : (
        <div className="row">
          {relevantServices.map((s) => (
            <div className="col-md-6 mb-3" key={s._id}>
              <div className="card h-100">
                <img src={s.imagePath} className="card-img-top" alt={s.title} style={{ height: 180, objectFit: "cover" }} />
                <div className="card-body d-flex flex-column">
                  <h5>{translateTitle(s.title)}</h5>
                  <p className="mb-1 text-muted">{translateDescription(s.title, s.description)}</p>
                  <p className="mb-1">
                    <strong>{formatPrice(s.price ?? 0)}</strong>
                  </p>
                  <p className="mb-2">
                    <strong>{t("dashboard.status")}: </strong>
                    <span
                      className={
                        s.status === "paid_full" ? "text-success" : s.status === "paid_half" ? "text-primary" : "text-muted"
                      }
                    >
                      {t(`status.${s.status}`, { defaultValue: s.status })}
                    </span>
                  </p>

                  <div className="mt-auto d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleOpenPayment(s)}>
                      {t("dashboard.payService") || "Pay Service"}
                    </button>
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => {
                        setSelected(s);
                        setShowUpload(true);
                      }}
                    >
                      {t("dashboard.sendProof")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PaymentModal
        show={showPayment}
        onHide={() => {
          setShowPayment(false);
          setPaymentService(null);
        }}
        service={paymentService}
        user={user}
        onShowPayInstructions={handleShowPayInstructions}
        onPaid={() => {
          handlePaid();
        }}
        apiBaseUrl={API}
      />

      <PayInstructionsModal
        show={showInstructions}
        onHide={() => {
          setShowInstructions(false);
          setBankInfo(null);
        }}
        bankInfo={bankInfo}
      />

      <UploadProofModal
        service={selected}
        user={user}
        onHide={() => {
          setShowUpload(false);
          setSelected(null);
        }}
        refresh={() => {
          refreshServices();
        }}
        apiBaseUrl={API}
      />

      {/* Proof of payment (if any) */}
      <ProofAttachment 
        filePath={userPayment?.proofFile} 
        serviceTitle={userPayment?.serviceTitle} 
      />
    </>
  );
}

export default UserDashboard;