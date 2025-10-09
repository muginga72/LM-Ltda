// src/components/Register.jsx
import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      // Safely parse JSON
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // ✅ redirect after successful signup
        navigate("/dashboard");
      } else {
        // Show backend error or fallback
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <Container style={{ maxWidth: 400, marginTop: 50 }}>
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSignup}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </Form.Group>

        {/* Removed role selector so users cannot choose admin */}
        <Button type="submit">Register</Button>
      </Form>
    </Container>
  );
}

export default Register;
