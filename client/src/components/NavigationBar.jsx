import React, { useContext, useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../assets/logo-v01.png";
import ProfileModal from "./ProfileModal";
// import BookRoomModal from "../components/roomrentals/BookRoomModal";

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  // const [showBookModal, setShowBookModal] = useState(false);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n.trim())
        .filter(Boolean)
        .map((n) => n[0]?.toUpperCase())
        .join("")
    : "";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarSize = 34;
  const avatar = user?.avatarUrl ? (
    <Image
      src={user.avatarUrl}
      roundedCircle
      width={avatarSize}
      height={avatarSize}
      alt="avatar"
    />
  ) : (
    <div
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: "50%",
        background: "#dee2e6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        color: "#495057",
        fontSize: 12,
        userSelect: "none",
      }}
      aria-hidden="true"
    >
      {initials || "?"}
    </div>
  );

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
                className="rounded"
              />
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={NavLink} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/services">
                Plan Services
              </Nav.Link>

              {/* <Nav.Link as={NavLink} to="/rooms">Rooms</Nav.Link> */}

              {/* <NavDropdown title="Rooms" id="rooms-nav-dropdown" align="end" role="menu">
                <LinkContainer to="/rooms/list">
                  <NavDropdown.Item>List Rooms</NavDropdown.Item>
                </LinkContainer>

                <NavDropdown.Item onClick={() => setShowBookModal(true)}>
                  Book Room
                </NavDropdown.Item>
              </NavDropdown> */}

              {!user ? (
                <>
                  <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/register">
                    Register
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/admin-login">
                    Admin
                  </Nav.Link>
                </>
              ) : (
                <>
                  {user.role === "admin" && (
                    <Nav.Link as={NavLink} to="/admin">
                      Dashboard
                    </Nav.Link>
                  )}
                  {user.role === "user" && (
                    <Nav.Link as={NavLink} to="/dashboard">
                      Dashboard
                    </Nav.Link>
                  )}

                  <Nav.Link
                    onClick={() => setShowProfileModal(true)}
                    className="d-flex align-items-center p-0 ms-2"
                    style={{ cursor: "pointer" }}
                    title="Profile"
                    aria-label="Open profile"
                  >
                    {avatar}
                  </Nav.Link>

                  <Nav.Link onClick={handleLogout} className="text-danger ms-2">
                    Logout
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {user && (
        <ProfileModal show={showProfileModal} onHide={() => setShowProfileModal(false)} />
      )}

      {/* <BookRoomModal show={showBookModal} onHide={() => setShowBookModal(false)} /> */}
    </>
  );
};

export default NavigationBar;