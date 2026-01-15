// src/components/roomrentals/BookingFormWithModal.jsx
import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import BookingForm from "./BookingForm";
import { useTranslation } from "react-i18next";

export default function BookingFormWithModal({
  room,
  user,
  token,
  apiBaseUrl,
  headers,
  onBooked,
  onCancel,
  onShowPayInstructions,
}) {
  const { t } = useTranslation();

  const [showPayInstructions, setShowPayInstructions] = useState(false);
  const [bankInfo, setBankInfo] = useState(null);
  const panelRef = useRef(null);
  const [copiedLabel, setCopiedLabel] = useState("");

  useEffect(() => {
    if (showPayInstructions && panelRef.current) {
      panelRef.current.focus({ preventScroll: false });
    }
  }, [showPayInstructions]);

  const handleShowPayInstructions = (info) => {
    setBankInfo(info);
    setShowPayInstructions(true);

    if (typeof onShowPayInstructions === "function") {
      onShowPayInstructions(info);
    }
  };

  const handleCopy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value ?? "");
      setCopiedLabel(label);
      setTimeout(() => setCopiedLabel(""), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const maskAccount = (acct = "") =>
    acct.length > 4 ? `****${acct.slice(-4)}` : acct;

  return (
    <Container className="py-3">
      <BookingForm
        room={room}
        user={user}
        token={token}
        apiBaseUrl={apiBaseUrl}
        headers={headers}
        onBooked={onBooked}
        onCancel={onCancel}
        onShowPayInstructions={handleShowPayInstructions}
      />

      {/* Bank Instructions Modal */}
      <Modal
        show={showPayInstructions}
        onHide={() => setShowPayInstructions(false)}
        centered
        size="md"
        aria-labelledby="payment-instructions-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="payment-instructions-title">
            {room
              ? t("bookingModal.payTitle", {
                  roomName:
                    room.roomTitle ?? room.title ?? room.name ?? t("bookingModal.room"),
                })
              : t("bookingModal.paymentInstructions")}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {bankInfo ? (
            <div
              ref={panelRef}
              tabIndex={-1}
              role="region"
              aria-labelledby="payment-instructions-title"
            >
              <h6 className="mb-3">{t("bookingModal.bankTransferTitle")}</h6>

              {/* BANK NAME */}
              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>{t("bookingModal.bank")}</strong>
                  <div>{bankInfo.bankName ?? "-"}</div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() =>
                      handleCopy(t("bookingModal.bank"), bankInfo.bankName)
                    }
                  >
                    {t("bookingModal.copy")}
                  </Button>
                </Col>
              </Row>

              {/* ACCOUNT NAME */}
              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>{t("bookingModal.accountName")}</strong>
                  <div>{bankInfo.accountName ?? "-"}</div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() =>
                      handleCopy(
                        t("bookingModal.accountName"),
                        bankInfo.accountName
                      )
                    }
                  >
                    {t("bookingModal.copy")}
                  </Button>
                </Col>
              </Row>

              {/* ACCOUNT NUMBER */}
              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>{t("bookingModal.accountNumber")}</strong>
                  <div>{maskAccount(bankInfo.accountNumber ?? "")}</div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() =>
                      handleCopy(
                        t("bookingModal.accountNumber"),
                        bankInfo.accountNumber
                      )
                    }
                  >
                    {t("bookingModal.copy")}
                  </Button>
                </Col>
              </Row>

              {/* ROUTING */}
              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>{t("bookingModal.routing")}</strong>
                  <div>{bankInfo.routingNumber ?? "-"}</div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() =>
                      handleCopy(
                        t("bookingModal.routing"),
                        bankInfo.routingNumber
                      )
                    }
                  >
                    {t("bookingModal.copy")}
                  </Button>
                </Col>
              </Row>

              {/* IBAN */}
              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>{t("bookingModal.iban")}</strong>
                  <div>{bankInfo.iban ?? "-"}</div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() =>
                      handleCopy(t("bookingModal.iban"), bankInfo.iban)
                    }
                  >
                    {t("bookingModal.copy")}
                  </Button>
                </Col>
              </Row>

              {/* REFERENCE */}
              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>{t("bookingModal.reference")}</strong>
                  <div>{bankInfo.reference ?? "-"}</div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() =>
                      handleCopy(
                        t("bookingModal.reference"),
                        bankInfo.reference
                      )
                    }
                  >
                    {t("bookingModal.copy")}
                  </Button>
                </Col>
              </Row>

              {/* AMOUNT */}
              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>{t("bookingModal.amount")}</strong>
                  <div>
                    {bankInfo.currency ?? "USD"} {bankInfo.amount ?? "-"}
                  </div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() =>
                      handleCopy(
                        t("bookingModal.amount"),
                        `${bankInfo.amount ?? ""}`
                      )
                    }
                  >
                    {t("bookingModal.copy")}
                  </Button>
                </Col>
              </Row>

              <div className="mt-3">
                <small className="text-muted">
                  {copiedLabel
                    ? t("bookingModal.copied", { field: copiedLabel })
                    : t("bookingModal.copyHint")}
                </small>
              </div>
            </div>
          ) : (
            <div className="text-center py-3">
              <Spinner animation="border" />
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPayInstructions(false)}
          >
            {t("bookingModal.close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

BookingFormWithModal.propTypes = {
  room: PropTypes.object,
  user: PropTypes.object,
  token: PropTypes.string,
  apiBaseUrl: PropTypes.string,
  headers: PropTypes.object,
  onBooked: PropTypes.func,
  onCancel: PropTypes.func,
  onShowPayInstructions: PropTypes.func,
};

BookingFormWithModal.defaultProps = {
  room: null,
  user: null,
  token: null,
  apiBaseUrl: "",
  headers: {},
  onBooked: null,
  onCancel: () => {},
  onShowPayInstructions: null,
};