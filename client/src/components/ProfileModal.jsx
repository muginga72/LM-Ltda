import React, { useContext, useState } from "react";
import axios from "axios";
import { Modal, Row, Col, Image, Form, Button, Card } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";

const ProfileModal = ({ show, onHide }) => {
  const { user } = useContext(AuthContext);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "/avatar.png");
  const [message, setMessage] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) throw new Error("No token found");

      const updatedUser = { fullName, email, avatar };
      const res = await axios.put("/api/users/profile", updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const {
        fullName: updatedName,
        email: updatedEmail,
        avatar: updatedAvatar,
      } = res.data;

      setFullName(updatedName);
      setEmail(updatedEmail);
      setAvatar(updatedAvatar);

      const storedUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          fullName: updatedName,
          email: updatedEmail,
          avatar: updatedAvatar,
        })
      );

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Your Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="p-3">
          <Row className="align-items-center">
            <Col md={4} className="text-center">
              <Image
                src={avatar}
                roundedCircle
                width="120"
                height="120"
                alt="User Avatar"
                style={{
                  objectFit: "cover",
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                }}
              />
            </Col>
            <Col md={8}>
              {message && <p className="text-success">{message}</p>}
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label>Fullname</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                  />
                </Form.Group>
                <div className="d-flex gap-3">
                  <Button variant="outline-primary" type="submit">
                    Save Changes
                  </Button>
                  <Button variant="outline-secondary" onClick={onHide}>
                    Close
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileModal;