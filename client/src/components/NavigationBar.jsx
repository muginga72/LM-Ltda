import React, { useContext, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import logo from '../assets/logo-v01.png';
// import logo from '../assets/logo.png';
import ProfileModal from './ProfileModal';

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex align-items-center gap-2">
              <img
                src={logo}
                alt="LM Ltd Logo"
                width="150"
                height="100"
                // className="rounded-circle"
                className="rounded"
              />
              {/* LM Ltd */}
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/services">Services</Nav.Link>

              {!user ? (
                <>
                  <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                  <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                  <Nav.Link as={NavLink} to="/admin-login">Admin</Nav.Link>
                </>
              ) : (
                <>
                  <Navbar.Text className="me-2">Hello, {user.name}</Navbar.Text>

                  {user.role === 'admin' && (
                    <Nav.Link as={NavLink} to="/admin">Dashboard</Nav.Link>
                  )}
                  {user.role === 'user' && (
                    <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
                  )}

                  <Nav.Link onClick={() => setShowProfileModal(true)} className="text-primary">
                    Profile
                  </Nav.Link>
                  <Nav.Link onClick={handleLogout} className="text-danger">
                    Logout
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
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
};

export default NavigationBar;