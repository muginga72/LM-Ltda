import React from "react";
import { Table, Alert } from "react-bootstrap";

function AdminSharedServicesTable({ services, error }) {
  return (
    <>
      <h5 className="mt-4 mb-3">📧 Shared Services</h5>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : services.length === 0 ? (
        <Alert variant="info">No shared services available.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Service Title</th>
              <th>Email</th>
              <th>Shared On</th>
            </tr>
          </thead>
          <tbody>
            {services.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.serviceTitle}</td>
                <td>{item.email}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default AdminSharedServicesTable;