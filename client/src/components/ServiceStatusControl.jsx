// components/ServiceStatusControl.jsx
import React from "react";
import axios from "axios";
import { Form } from "react-bootstrap";

function ServiceStatusControl({
  serviceId,
  currentStatus = "unpaid",
  type,
  token,
  onStatusUpdate,
}) {
  const getStatusVariant = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "unpaid":
      default:
        return "danger";
    }
  };

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const response = await axios.patch(
        `/api/admin/update-status/${serviceId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        }
      );

      // Use the response or at least check it
      if (response.status === 200) {
        if (onStatusUpdate) {
          onStatusUpdate(serviceId, newStatus, type);
        }
      } else {
        console.warn("Unexpected response:", response);
        alert("Unexpected server response while updating status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="d-flex flex-column align-items-start gap-1">
      <Form.Select
        size="sm"
        value={currentStatus}
        onChange={handleChange}
        className={`text-${getStatusVariant(currentStatus)} fw-bold`}
      >
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="unpaid">Unpaid</option>
      </Form.Select>
    </div>
  );
}

export default ServiceStatusControl;