// // components/PaymentModal.jsx
// import React, { useEffect, useState } from "react";
// import { Modal, Button, Form, Spinner } from "react-bootstrap";
// import { useTranslation } from "react-i18next";
// import axios from "axios";

// export default function PaymentModal({
//   show,
//   onHide,
//   service,
//   user,
//   onShowPayInstructions,
//   onPaid,
//   apiBaseUrl,
// }) {
//   const { t, i18n } = useTranslation();
//   const [method, setMethod] = useState("bank");
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState(null);

//   const API = apiBaseUrl || process.env.REACT_APP_API_URL || "";

//   useEffect(() => {
//     if (!show) {
//       setMethod("bank");
//       setProcessing(false);
//       setError(null);
//     }
//   }, [show]);

//   if (!service) return null;

//   const handlePay = async () => {
//     setProcessing(true);
//     setError(null);

//     try {
//       if (method === "bank") {
//         const bankInfo = {
//           accountName: "Maria Miguel",
//           accountNumber: "34229556030001",
//           routingNumber: "AO06 0006 0000 42295560301 25",
//           bankName: "BFA",
//           reference: `SERVICE-${service._id ?? service.id ?? "unknown"}`,
//           amount: service.price ?? 0,
//           currency: "USD",
//           service,
//           user,
//         };
//         if (typeof onShowPayInstructions === "function") {
//           onShowPayInstructions(bankInfo);
//         }
//       } else {
//         // Card payment: call backend if available
//         try {
//           await axios.post(`${API}/api/payments/charge`, {
//             serviceId: service._id ?? service.id,
//             userId: user?.id,
//             amount: service.price ?? 0,
//             method: "card",
//           });
//           if (typeof onPaid === "function") onPaid();
//         } catch (err) {
//           // If backend not available, still call onPaid to refresh UI in dev
//           if (typeof onPaid === "function") onPaid();
//         }
//       }

//       onHide();
//     } catch (err) {
//       setError(t?.("payment.paymentError") || "Payment failed");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>{t?.("payment.title") || "Pay for service"}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {error && <div className="alert alert-danger">{error}</div>}
//         <p>
//           <strong>{service.title}</strong>
//         </p>
//         <p>
//           {t?.("payment.amount") || "Amount"}:{" "}
//           <strong>
//             {new Intl.NumberFormat(i18n?.language || "en-US", {
//               style: "currency",
//               currency: "USD",
//             }).format(Number(service.price ?? 0))}
//           </strong>
//         </p>

//         <Form>
//           <Form.Check
//             type="radio"
//             id="pay-card"
//             name="paymentMethod"
//             label={t?.("payment.method.card") || "Card"}
//             checked={method === "card"}
//             onChange={() => setMethod("card")}
//           />
//           <Form.Check
//             type="radio"
//             id="pay-bank"
//             name="paymentMethod"
//             label={t?.("payment.method.bank") || "Bank transfer"}
//             checked={method === "bank"}
//             onChange={() => setMethod("bank")}
//             className="mt-2"
//           />
//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="outline-secondary" onClick={onHide} disabled={processing}>
//           {t?.("payment.cancel") || "Cancel"}
//         </Button>
//         <Button variant="primary" onClick={handlePay} disabled={processing}>
//           {processing ? <Spinner animation="border" size="sm" /> : t?.("payment.pay") || "Pay"}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }


import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function PaymentModal({
  show,
  onHide,
  service,
  user,
  onShowPayInstructions,
  onPaid,
  apiBaseUrl,
}) {
  const { t, i18n } = useTranslation();
  const [method, setMethod] = useState("bank");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");

  // Resolve API base
  const API = apiBaseUrl || process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    if (!show) {
      // reset when modal closes
      setMethod("bank");
      setProcessing(false);
      setError(null);
      setAmount("");
      setNote("");
      setReference("");
    } else {
      // prefill amount from service if available
      const svcAmount =
        service && (service.price || service.amount || service.total);
      setAmount(svcAmount ? String(svcAmount) : "");
      // generate a reference for this payment attempt
      const idPart = service && (service._id || service.id) ? (service._id || service.id) : Date.now();
      setReference(`SERVICE-${idPart}-${Math.floor(Math.random() * 9000 + 1000)}`);
    }
  }, [show, service]);

  if (!service) return null;

  const handlePay = async () => {
    setProcessing(true);
    setError(null);

    try {
      // Basic validation
      const numericAmount = Number(amount);
      if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
        setError(t("payment.invalidAmount") || "Please enter a valid amount.");
        setProcessing(false);
        return;
      }

      // Build bank info payload (for bank transfer method)
      const bankInfo = {
        accountName: "Maria Miguel",
        accountNumber: "34229556030001",
        routingNumber: "AO06 0006 0000 42295560301 25",
        bankName: "BFA",
        reference,
        amount: numericAmount,
        currency: service.currency || "AOA" || "USD",
        serviceId: service._id || service.id || null,
        serviceTitle: service.serviceTitle || service.title || service.name || "",
        userEmail: user?.email || null,
        userFullName: user?.fullName || user?.name || null,
        note: note || "",
      };

      // If an API is available, attempt to create a payment intent / record on the server.
      // This is optional: if the server endpoint exists it will return authoritative bank instructions.
      let serverBankInfo = null;
      if (API) {
        try {
          const url = `${API.replace(/\/$/, "")}/api/payments/initiate`;
          const payload = {
            method,
            amount: numericAmount,
            currency: bankInfo.currency,
            reference: bankInfo.reference,
            serviceId: bankInfo.serviceId,
            serviceTitle: bankInfo.serviceTitle,
            userEmail: bankInfo.userEmail,
            userFullName: bankInfo.userFullName,
            note: bankInfo.note,
          };
          const res = await axios.post(url, payload, {
            headers: { "Content-Type": "application/json" },
          });
          // If server returns bank instructions, use them
          if (res && res.data) {
            // Expect server to return an object like { bankInfo: { ... } } or the bank info directly
            serverBankInfo = res.data.bankInfo || res.data;
          }
        } catch (err) {
          // If server call fails, we don't block the flow; fallback to local bankInfo
          console.warn("Payment initiation endpoint not available or failed:", err);
        }
      }

      // Use server-provided bank info if available, otherwise fallback to local bankInfo
      const finalBankInfo = serverBankInfo || bankInfo;

      // Notify parent to show bank instructions modal
      if (typeof onShowPayInstructions === "function") {
        onShowPayInstructions(finalBankInfo);
      }

      // Optionally mark the service as "payment initiated" or "pending" by calling onPaid/onPaid-like callback.
      // onPaid can be used by parent to refresh lists or mark state.
      if (typeof onPaid === "function") {
        try {
          // Provide a lightweight payload to parent so it can update UI
          onPaid({
            serviceId: finalBankInfo.serviceId,
            reference: finalBankInfo.reference,
            amount: finalBankInfo.amount,
            currency: finalBankInfo.currency,
            status: "pending",
          });
        } catch (err) {
          console.warn("onPaid callback threw an error:", err);
        }
      }

      // Close this modal (parent may open bank modal)
      if (typeof onHide === "function") {
        onHide();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || (t("payment.failed") || "Payment failed. Please try again."));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {t("payment.title", { defaultValue: "Pay for service" })} -{" "}
          {service.serviceTitle || service.title || service.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error ? <Alert variant="danger">{error}</Alert> : null}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{t("payment.method", { defaultValue: "Payment method" })}</Form.Label>
            <div>
              <Form.Check
                inline
                label={t("payment.method.bank", { defaultValue: "Bank transfer" })}
                type="radio"
                id="method-bank"
                name="paymentMethod"
                checked={method === "bank"}
                onChange={() => setMethod("bank")}
              />
              <Form.Check
                inline
                label={t("payment.method.card", { defaultValue: "Card (online)" })}
                type="radio"
                id="method-card"
                name="paymentMethod"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("payment.amount", { defaultValue: "Amount" })}</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t("payment.amountPlaceholder", { defaultValue: "Enter amount" })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("payment.reference", { defaultValue: "Reference" })}</Form.Label>
            <Form.Control
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={t("payment.referencePlaceholder", { defaultValue: "Payment reference" })}
            />
            <Form.Text className="text-muted">
              {t("payment.referenceHelp", {
                defaultValue: "Use this reference when making the bank transfer so we can match your payment.",
              })}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("payment.note", { defaultValue: "Note (optional)" })}</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("payment.notePlaceholder", { defaultValue: "Add a note for the payment" })}
            />
          </Form.Group>

          {method === "bank" ? (
            <div className="alert alert-info">
              <strong>{t("payment.bankInfoTitle", { defaultValue: "Bank transfer instructions" })}</strong>
              <div className="mt-2">
                {t("payment.bankInfoSummary", {
                  defaultValue:
                    "After you click Continue, we will show bank details and a reference. Make the transfer and then use Send Proof to upload your receipt.",
                })}
              </div>
            </div>
          ) : (
            <div className="alert alert-secondary">
              {t("payment.cardInfo", {
                defaultValue:
                  "Card payments will redirect you to a secure payment page (if configured). If your server does not support card payments, use bank transfer.",
              })}
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={processing}>
          {t("button.cancel", { defaultValue: "Cancel" })}
        </Button>
        <Button variant="primary" onClick={handlePay} disabled={processing}>
          {processing ? <Spinner animation="border" size="sm" /> : t("payment.continue", { defaultValue: "Continue" })}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}