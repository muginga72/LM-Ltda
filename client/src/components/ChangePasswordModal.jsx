// src/components/ChangePasswordModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";

const MIN_PASSWORD_LENGTH = 8;

export default function ChangePasswordModal({ show, onHide, apiBase, userId, token }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccessMsg(null);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const validate = () => {
    if (!currentPassword) return "Enter your current password.";
    if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
      return `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (newPassword !== confirmPassword) return "New password and confirmation do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const base = apiBase || "";
      const url = `${base.replace(/\/$/, "")}/api/users/${encodeURIComponent(userId)}/change-password`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
        credentials: "include",
      });

      if (res.status === 200) {
        setSuccessMsg("Password updated successfully.");
        // Clear sensitive fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Optionally close after a short delay
        setTimeout(() => {
          handleClose();
        }, 900);
      } else if (res.status === 401) {
        setError("Current password is incorrect.");
      } else if (res.status === 400) {
        const body = await res.json().catch(() => ({}));
        setError(body?.message || "Invalid request.");
      } else {
        setError("Failed to update password. Try again later.");
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("change-password error", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Change password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMsg && <Alert variant="success">{successMsg}</Alert>}

          <Form.Group className="mb-3" controlId="currentPassword">
            <Form.Label>Current password</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>New password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
            />
            <Form.Text className="text-muted">
              Minimum {MIN_PASSWORD_LENGTH} characters.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-0" controlId="confirmPassword">
            <Form.Label>Confirm new password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Update password"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

ChangePasswordModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  apiBase: PropTypes.string,
  userId: PropTypes.string.isRequired,
  token: PropTypes.string,
};