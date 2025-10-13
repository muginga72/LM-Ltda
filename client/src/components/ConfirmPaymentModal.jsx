// src/components/ConfirmPaymentModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { Button, Modal, Table, Spinner, Form } from "react-bootstrap";

function ConfirmPaymentModal({ fullName, service, user, fetchAllServices }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [amountPaid, setAmountPaid] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const [customerEmail, setCustomerEmail] = useState(
    service?.userEmail || service?.email || service?.user?.email || ""
  );

  const handleOpen = async () => {
    setShow(true);
    setFetchingPrice(true);
    try {
      const res = await axios.get("/api/services");
      const services = res.data.services || [];
      const matched = services.find(
        (s) =>
          s.title.replace(/\s+/g, "").toLowerCase() ===
          service.serviceTitle.replace(/\s+/g, "").toLowerCase()
      );
      if (matched) {
        setPrice(matched.price);
      } else {
        setPrice("N/A");
      }
    } catch (err) {
      console.error("Error fetching service price:", err);
      setPrice("N/A");
    } finally {
      setFetchingPrice(false);
    }
  };

  const handleClose = () => setShow(false);

  const handleConfirmPayment = async () => {
    if (!amountPaid || !referenceId || !customerEmail) {
      alert("Please fill in Amount Paid, Payment Method, and Customer Email.");
      return;
    }

    setLoading(true);
    try {
      const totalAmount =
        price && !isNaN(price) ? parseFloat(price) : service.totalAmount;

      const paidAmount = amountPaid === "full" ? totalAmount : totalAmount / 2;

      // FIXED: added /api prefix
      await axios.post(
        "/api/payments/proof-payment-received",
        {
          fullName: service.fullName || service.name || "Valued Customer",
          serviceId: service._id,
          userEmail: customerEmail,
          serviceTitle: service.serviceTitle,
          amountPaid: paidAmount,
          totalAmount,
          submissionMethod: referenceId,
          dateReceived: new Date().toISOString().split("T")[0],
          referenceId,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      alert("Payment confirmation email sent and status updated.");
      if (fetchAllServices) {
        fetchAllServices();
      }
      handleClose();
    } catch (err) {
      console.error("Error confirming payment:", err);
      alert("Failed to confirm payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger link/button */}
      <div className="text-center">
        <Button
          variant="link"
          size="sm"
          onClick={handleOpen}
          className="p-0 text-decoration-none"
        >
          Send Email
        </Button>
      </div>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="text-center">Service & User Details</h6>
          <p className="text-danger">
            Please check the proof of payment before sending the payment
            confirmation email to the customer.
          </p>
          <Form.Group controlId={customerEmail} className="mb-2">
            <Form.Label><strong>Customer Email</strong></Form.Label>
            <Form.Control
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Enter customer email"
              required
            />
          </Form.Group>
          <Table bordered size="sm">
            <tbody>
              <tr>
                <th>Customer Name</th>
                <td>{service.fullName}</td>
              </tr>
              <tr>
                <th>Service Title</th>
                <td>{service.serviceTitle}</td>
              </tr>
              <tr>
                <th>Service ID</th>
                <td>{service._id}</td>
              </tr>
              <tr>
                <th>Total Amount</th>
                <td>
                  {fetchingPrice ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    `$${price || "N/A"}`
                  )}
                </td>
              </tr>
              <tr>
                <th>Date Received</th>
                <td>{new Date().toLocaleDateString()}</td>
              </tr>
            </tbody>
          </Table>

          {/* Dropdowns */}
          <Form.Group className="mb-2">
            <Form.Label><strong>Amount Paid</strong></Form.Label>
            <Form.Select
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
            >
              <option value="">Select amount</option>
              <option value="half">Half amount</option>
              <option value="full">Full amount</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label><strong>Payment Method</strong></Form.Label>
            <Form.Select
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
            >
              <option value="">Select proof</option>
              <option value="Bank Deposit">Bank Deposit Receipt</option>
              <option value="Bank Transfer">Bank Transfer Document</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleConfirmPayment}
            disabled={loading || fetchingPrice}
          >
            {loading ? "Sending..." : "Confirm & Send"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmPaymentModal;