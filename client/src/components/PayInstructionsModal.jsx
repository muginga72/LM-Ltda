// components/PayInstructionsModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function PayInstructionsModal({ show, onHide, bankInfo }) {
  const { t } = useTranslation();

  if (!bankInfo) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t?.("payment.instructionsTitle") || "Bank transfer instructions"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>{t?.("payment.reference") || "Reference"}:</strong> {bankInfo.reference}
        </p>
        <p>
          <strong>{t?.("payment.bankName") || "Bank"}:</strong> {bankInfo.bankName}
        </p>
        <p>
          <strong>{t?.("payment.accountName") || "Account name"}:</strong> {bankInfo.accountName}
        </p>
        <p>
          <strong>{t?.("payment.accountNumber") || "Account number"}:</strong> {bankInfo.accountNumber}
        </p>
        <p>
          <strong>{t?.("payment.routingNumber") || "Routing/IBAN"}:</strong> {bankInfo.routingNumber}
        </p>
        <p>
          <strong>{t?.("payment.amount") || "Amount"}:</strong>{" "}
          {new Intl.NumberFormat("en-US", { style: "currency", currency: bankInfo.currency || "USD" }).format(
            Number(bankInfo.amount ?? 0)
          )}
        </p>

        <div className="alert alert-info">
          {t?.("payment.instructionsNote") ||
            "After you complete the transfer, please upload the proof of payment using the Upload Proof button."}
            <p>
              <a href="mailto:lmj.muginga@gmail.com">LM-ltd Team</a>.
            </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          {t?.("payment.close") || "Close"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}