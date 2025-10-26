import React from "react";
import { Table, Alert } from "react-bootstrap";
import ServiceStatusControl from "../../ServiceStatusControl";

function AdminRequestedServicesTable({ services, error, token, onStatusUpdate }) {
  return (
    <>
      <h5 className="mt-4 mb-3">📝 Requested Services</h5>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : services.length === 0 ? (
        <Alert variant="info">No requested services available.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Service Title</th>
              <th>Service Type</th>
              <th>Fullname</th>
              <th>Details</th>
              <th>Requested On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {services.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.serviceTitle}</td>
                <td>{item.serviceType}</td>
                <td>{item.fullName}</td>
                <td>{item.details || "—"}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <ServiceStatusControl
                    serviceId={item._id}
                    currentStatus={item.status || (item.paid ? "paid" : "unpaid")}
                    type="requested"
                    token={token}
                    onStatusUpdate={onStatusUpdate}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default AdminRequestedServicesTable;