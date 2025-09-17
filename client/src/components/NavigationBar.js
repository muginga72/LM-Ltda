// client/src/components/NavigationBar.js
import React, { useContext } from 'react';
import {
  Navbar,
  Nav,
  Container,
  Image,
  Dropdown
} from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function NavigationBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fallback avatar image
  const defaultAvatar = '/images/avatar.png';

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold text-primary">
          LM Ltda
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/services">Services</Nav.Link>

            {!user ? (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-avatar"
                  className="d-flex align-items-center border-0 bg-transparent"
                >
                  <Image
                    src={user.avatar || defaultAvatar}
                    roundedCircle
                    width="32"
                    height="32"
                    className="me-2"
                    alt="User Avatar"
                    style={{ objectFit: 'cover' }}
                  />
                  <span className="fw-semibold">{user.name}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}