import React, { useContext, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";

function Profile() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "/avatar.png");
  const [message, setMessage] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) throw new Error("No token found");

      const updatedUser = { name, email, avatar };

      const res = await axios.put("/api/users/profile", updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Use the response data
      const {
        name: updatedName,
        email: updatedEmail,
        avatar: updatedAvatar,
      } = res.data;

      setName(updatedName);
      setEmail(updatedEmail);
      setAvatar(updatedAvatar);

      // Optionally update localStorage or context
      const storedUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          name: updatedName,
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
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm">
            <Row className="align-items-center">
              <Col md={4} className="text-center">
                <Image
                  // src={avatar}
                  src="/images/avatar.png"
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
                <h3 className="m-3 text-center">Your Profile</h3>
                {message && <p className="text-success">{message}</p>}
                <Form onSubmit={handleSave}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
