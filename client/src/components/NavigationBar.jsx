// client/src/components/NavigationBar.js
import React, { useContext, useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import ProfileModal from './ProfileModal'; // <-- new modal component

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <>
      <Navbar bg="light" expand>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex align-items-center gap-2">
              <img
                src={logo}
                alt="LMJ Logo"
                width="50"
                height="50"
                className="rounded-circle"
              />
              LM Ltda
            </Navbar.Brand>
          </LinkContainer>

          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/services">Services</Nav.Link>

            {!user ? (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            ) : (
              <>
                <Navbar.Text className="me-2">Hello, {user.name}</Navbar.Text>
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => setShowProfileModal(true)}
                >
                  Profile
                </Button>
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* Profile Modal */}
      {user && (
        <ProfileModal
          show={showProfileModal}
          onHide={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
}

export default NavigationBar;