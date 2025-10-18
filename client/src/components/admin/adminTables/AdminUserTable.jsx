import React from "react";
import { Table, Alert } from "react-bootstrap";

function AdminUserTable({ users, error }) {
  return (
    <>
      <h4 className="mb-3">👥 All Users</h4>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : users.length === 0 ? (
        <Alert variant="info">No users found.</Alert>
      ) : (
        <Table striped bordered hover responsive className="mb-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u._id}>
                <td>{index + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default AdminUserTable;