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


// import React, { useState, useContext } from "react";
// import { Form, Button, Alert, Spinner, Container, Row, Col } from "react-bootstrap";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../contexts/AuthContext";

// export default function AdminLoginPage() {
//   const { setUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await axios.post("/api/admin/login", { email, password });

//       const { token, admin } = res.data;

//       if (!token || !admin) {
//         throw new Error("Invalid response from server");
//       }

//       // Save token and admin info (you can also use localStorage if needed)
//       setUser({ ...admin, token });

//       // Redirect to admin dashboard
//       navigate("/admin/dashboard");
//     } catch (err) {
//       console.error("Admin login error:", err);
//       setError(
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         err.message ||
//         "Login failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <Container className="mt-5">
//       <Row className="justify-content-center">
//         <Col md={6} lg={5}>
//           <h3 className="mb-4 text-center">Admin Login</h3>
//           {error && <Alert variant="danger">{error}</Alert>}
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3" controlId="adminEmail">
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="admin@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="adminPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <div className="d-grid">
//               <Button variant="primary" type="submit" disabled={loading}>
//                 {loading ? <Spinner animation="border" size="sm" /> : "Login"}
//               </Button>
//             </div>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// }