// src/components/ConfirmPaymentModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { Button, Modal, Table, Spinner, Form } from "react-bootstrap";

function ConfirmPaymentModal({ service, user, fetchAllServices }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [amountPaid, setAmountPaid] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const [customerEmail, setCustomerEmail] = useState(
    service?.email || service?.user?.email || ""
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

      await axios.post(
        "http://localhost:5000/api/payments/proof-payment-received",
        {
          fullName: service.fullName || service.name || "Valued Customer",
          serviceId: service._id,
          email: customerEmail,
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

// import React, { useState } from "react";
// import api from "../api";
// import { Button, Modal, Table, Spinner, Form, Alert } from "react-bootstrap";

// function ConfirmPaymentModal({ service, user, fetchAllServices }) {
//   const [show, setShow] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [price, setPrice] = useState(null);
//   const [fetchingPrice, setFetchingPrice] = useState(false);
//   const [amountPaid, setAmountPaid] = useState("");
//   const [referenceId, setReferenceId] = useState("");
//   const [customerEmail, setCustomerEmail] = useState("");
//   const [fetchingEmail, setFetchingEmail] = useState(false);
//   const [uiError, setUiError] = useState(null);

//   const getCustomerId = () =>
//     service?.email || service?.userId || service?.user?._id || null;

//   const handleOpen = async () => {
//     setUiError(null);
//     setShow(true);

//     // Fetch service price
//     setFetchingPrice(true);
//     try {
//       const res = await api.get("/services");
//       const matched = res.data.services?.find(
//         (s) =>
//           s.title?.replace(/\s+/g, "").toLowerCase() ===
//           service.serviceTitle?.replace(/\s+/g, "").toLowerCase()
//       );
//       setPrice(matched?.price || "N/A");
//     } catch (err) {
//       console.error("Error fetching price:", err);
//       setPrice("N/A");
//     } finally {
//       setFetchingPrice(false);
//     }

//     // Fetch customer email
//     const customerId = getCustomerId();
//     if (!customerId) {
//       setUiError("Customer ID missing. Cannot fetch email.");
//       return;
//     }

//     setFetchingEmail(true);
//     try {
//       const res = await api.get(`/users/${email}`);
//       const email =
//         res.data?.user?.email ||
//         res.data?.email ||
//         // res.data?.userEmail ||
//         "";
//       if (email) {
//         setCustomerEmail(email);
//       } else {
//         setUiError("Customer found but no email available.");
//       }
//     } catch (err) {
//       console.error("Error fetching email:", err);
//       const status = err?.response?.status;
//       if (status === 404) {
//         setUiError("Customer not found (404).");
//       } else if (status === 401 || status === 403) {
//         setUiError("Unauthorized to fetch customer email.");
//       } else {
//         setUiError("Failed to fetch customer email.");
//       }
//       // fallback to service-provided email
//       const fallbackEmail =
//         service?.email || service?.user?.email || "";
//       if (fallbackEmail) setCustomerEmail(fallbackEmail);
//     } finally {
//       setFetchingEmail(false);
//     }
//   };

//   const handleClose = () => {
//     setUiError(null);
//     setShow(false);
//   };

//   const handleConfirmPayment = async () => {
//     setUiError(null);
//     if (!amountPaid || !referenceId || !customerEmail) {
//       setUiError("Missing required fields.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const totalAmount =
//         price && !isNaN(price) ? parseFloat(price) : service.totalAmount;
//       const paidAmount = amountPaid === "full" ? totalAmount : totalAmount / 2;

//       await api.post("/payments/proof-payment-received", {
//         serviceId: service._id,
//         email: customerEmail,
//         serviceTitle: service.serviceTitle,
//         amountPaid: paidAmount,
//         totalAmount,
//         submissionMethod: referenceId,
//         dateReceived: new Date().toISOString().split("T")[0],
//         referenceId,
//       });

//       alert("Confirmation email sent.");
//       fetchAllServices?.();
//       handleClose();
//     } catch (err) {
//       console.error("Error confirming payment:", err);
//       const status = err?.response?.status;
//       if (status === 403) {
//         setUiError("403 Forbidden: Admin access required.");
//       } else if (status === 401) {
//         setUiError("401 Unauthorized: Please sign in.");
//       } else {
//         setUiError("Failed to confirm payment.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="text-center">
//         <Button variant="link" size="sm" onClick={handleOpen} className="p-0 text-decoration-none">
//           Send Email
//         </Button>
//       </div>

//       <Modal show={show} onHide={handleClose} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Payment Confirmation</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {uiError && <Alert variant="danger">{uiError}</Alert>}
//           <h6>Service & User Details</h6>
//           <Table bordered size="sm">
//             <tbody>
//               <tr><th>Service Title</th><td>{service.serviceTitle}</td></tr>
//               <tr><th>Service ID</th><td>{service._id}</td></tr>
//               <tr>
//                 <th>Customer Email</th>
//                 <td>
//                   {fetchingEmail ? (
//                     <Spinner animation="border" size="sm" />
//                   ) : (
//                     <Form.Control type="email" value={customerEmail} readOnly plaintext />
//                   )}
//                 </td>
//               </tr>
//               <tr><th>Total Amount</th><td>{fetchingPrice ? <Spinner animation="border" size="sm" /> : `$${price || "N/A"}`}</td></tr>
//               <tr><th>Date Received</th><td>{new Date().toLocaleDateString()}</td></tr>
//             </tbody>
//           </Table>

//           <Form.Group className="mb-3">
//             <Form.Label>Amount Paid</Form.Label>
//             <Form.Select value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)}>
//               <option value="">Select...</option>
//               <option value="half">Half</option>
//               <option value="full">Full</option>
//             </Form.Select>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Payment Method</Form.Label>
//             <Form.Select value={referenceId} onChange={(e) => setReferenceId(e.target.value)}>
//               <option value="">Select...</option>
//               <option value="Bank Deposit">Bank Deposit</option>
//               <option value="Bank Transfer">Bank Transfer</option>
//             </Form.Select>
//           </Form.Group>

//           <p className="text-danger">
//             Email will be sent to the fetched customer email to reduce manual mistakes.
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose} disabled={loading}>Cancel</Button>
//           <Button variant="success" onClick={handleConfirmPayment} disabled={loading || fetchingEmail || fetchingPrice}>
//             {loading ? "Sending..." : "Confirm & Send"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

// export default ConfirmPaymentModal;