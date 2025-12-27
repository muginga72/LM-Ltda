import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import BookingForm from "./BookingForm";

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
  const [showPayInstructions, setShowPayInstructions] = useState(false);
  const [bankInfo, setBankInfo] = useState(null);
  const panelRef = useRef(null);
  const [copiedLabel, setCopiedLabel] = useState("");

  useEffect(() => {
    if (showPayInstructions && panelRef.current) {
      // focus the panel for accessibility
      panelRef.current.focus({ preventScroll: false });
    }
  }, [showPayInstructions]);

  const handleShowPayInstructions = (info) => {
    setBankInfo(info);
    setShowPayInstructions(true);

    // bubble up if parent provided a handler
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

  const maskAccount = (acct = "") => (acct.length > 4 ? `****${acct.slice(-4)}` : acct);

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

      {/* Modal style panel for bank instructions */}
      <Modal
        show={showPayInstructions}
        onHide={() => setShowPayInstructions(false)}
        centered
        size="md"
        aria-labelledby="payment-instructions-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="payment-instructions-title">
            {room ? `Pay: ${room.roomTitle ?? room.title ?? room.name}` : "Payment instructions"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {bankInfo ? (
            <div ref={panelRef} tabIndex={-1} role="region" aria-labelledby="payment-instructions-title">
              <h6 className="mb-3">Bank transfer instructions</h6>

              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>Bank</strong>
                  <div>{bankInfo.bankName ?? "-"}</div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button size="sm" variant="outline-secondary" onClick={() => handleCopy("Bank", bankInfo.bankName)}>
                    Copy
                  </Button>
                </Col>
              </Row>

              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>Account name</strong>
                  <div>{bankInfo.accountName ?? "-"}</div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button size="sm" variant="outline-secondary" onClick={() => handleCopy("Account name", bankInfo.accountName)}>
                    Copy
                  </Button>
                </Col>
              </Row>

              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>Account number</strong>
                  <div>{maskAccount(bankInfo.accountNumber ?? "")}</div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button size="sm" variant="outline-secondary" onClick={() => handleCopy("Account number", bankInfo.accountNumber)}>
                    Copy
                  </Button>
                </Col>
              </Row>

              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>Routing / Sort code</strong>
                  <div>{bankInfo.routingNumber ?? "-"}</div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button size="sm" variant="outline-secondary" onClick={() => handleCopy("Routing", bankInfo.routingNumber)}>
                    Copy
                  </Button>
                </Col>
              </Row>

              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>IBAN</strong>
                  <div>{bankInfo.iban ?? "-"}</div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button size="sm" variant="outline-secondary" onClick={() => handleCopy("IBAN", bankInfo.iban)}>
                    Copy
                  </Button>
                </Col>
              </Row>

              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>Reference</strong>
                  <div>{bankInfo.reference ?? "-"}</div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button size="sm" variant="outline-secondary" onClick={() => handleCopy("Reference", bankInfo.reference)}>
                    Copy
                  </Button>
                </Col>
              </Row>

              <Row className="mb-2 align-items-start">
                <Col xs={8}>
                  <strong>Amount</strong>
                  <div>
                    {bankInfo.currency ?? "USD"} {bankInfo.amount ?? "-"}
                  </div>
                </Col>
                <Col xs={4} className="text-end">
                  <Button size="sm" variant="outline-secondary" onClick={() => handleCopy("Amount", `${bankInfo.amount ?? ""}`)}>
                    Copy
                  </Button>
                </Col>
              </Row>

              <div className="mt-3">
                <small className="text-muted">
                  {copiedLabel ? `Copied ${copiedLabel}` : "Use the Copy buttons to copy details to clipboard."}
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
          <Button variant="secondary" onClick={() => setShowPayInstructions(false)}>
            Close
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
}