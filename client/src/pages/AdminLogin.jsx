import React, { useState, useContext } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function AdminLogin() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role !== "admin") {
        setError("Access denied: Admins only");
        return;
      }
      nav("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Container style={{ maxWidth: 400, marginTop: 50 }}>
        <h2>Admin</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e. g. example@lm-ltd.com"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </Form.Group>
          <Button type="submit" className="mb-3">Login as Admin</Button>
        </Form>
      </Container>
      <hr />
      <footer className="text-center py-2">
        <small>
          &copy; {new Date().getFullYear()} LM-Ltd Services. All rights reserved.
        </small>
      </footer>
    </>
  );
}

export default AdminLogin;