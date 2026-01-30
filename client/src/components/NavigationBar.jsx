// src/components/NavigationBar.jsx
import React, { useContext, useEffect, useState, useCallback } from "react";
import { Navbar, Nav, Container, Image, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../assets/logo-v01.png";
import ProfileModal from "./ProfileModal";
import {
  computeInitialsFromName,
  resolveApiBase,
  resolveAvatar as resolveAvatarHelper,
  checkImageExists,
} from "../utils/avatarHelpers";

const avatarSize = 34;

const NavigationBar = ({ apiBaseProp }) => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null); // only string or null
  const [initials, setInitials] = useState("?");
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const resolvedApiBase = useCallback(() => resolveApiBase(apiBaseProp), [apiBaseProp]);

  const buildAbsolute = useCallback(
    (maybeUrl) => {
      if (!maybeUrl) return null;
      try {
        return new URL(maybeUrl).toString();
      } catch {
        try {
          const base = resolvedApiBase() || (typeof window !== "undefined" ? window.location.origin : "");
          return new URL(maybeUrl, base).toString();
        } catch {
          return maybeUrl;
        }
      }
    },
    [resolvedApiBase]
  );

  const resolveAvatar = useCallback(
    async (u) => {
      setLoadingAvatar(true);
      try {
        if (!u) {
          setAvatarUrl(null);
          return;
        }

        // Prefer the helper that returns a string URL or null
        const resolved = await resolveAvatarHelper(u, apiBaseProp);
        if (typeof resolved === "string" && resolved.trim() !== "") {
          setAvatarUrl(resolved);
          return;
        }

        // Fallback: check candidate fields manually and only set avatarUrl to a string when checkImageExists returns true
        const candidates = [u.avatarUrl, u.avatar, u.image, u.photo, u.picture, u.profileImage].filter(Boolean);
        for (const c of candidates) {
          const abs = buildAbsolute(c);
          if (!abs) continue;
          // eslint-disable-next-line no-await-in-loop
          const exists = await checkImageExists(abs);
          if (exists) {
            setAvatarUrl(abs);
            return;
          }
        }

        // No valid image found
        setAvatarUrl(null);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("resolveAvatar error:", err);
        setAvatarUrl(null);
      } finally {
        setLoadingAvatar(false);
      }
    },
    [apiBaseProp, buildAbsolute]
  );

  useEffect(() => {
    const name = user?.fullName ?? user?.name ?? user?.displayName ?? "";
    setInitials(name ? computeInitialsFromName(name) : "?");

    if (user) {
      resolveAvatar(user);
    } else {
      setAvatarUrl(null);
    }
  }, [user, resolveAvatar]);

  const handleLogout = () => {
    try {
      if (typeof logout === "function") logout();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("logout error:", err);
    }
    navigate("/login");
  };

  // Avatar element: spinner while checking, image when avatarUrl is a non-empty string, otherwise initials
  const avatarElement = loadingAvatar ? (
    <div
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: "50%",
        background: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-hidden="true"
      title={t("userTitle", { name: user?.fullName ?? "User" })}
    >
      <Spinner animation="border" size="sm" />
    </div>
  ) : typeof avatarUrl === "string" && avatarUrl.trim() !== "" ? (
    <Image
      src={avatarUrl}
      roundedCircle
      width={avatarSize}
      height={avatarSize}
      alt={t("userAvatarAlt", { name: user?.fullName ?? "User" })}
      style={{ objectFit: "cover" }}
      onError={() => {
        // If the image fails to load at runtime, clear avatarUrl so initials show
        setAvatarUrl(null);
      }}
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
      title={t("userTitle", { name: user?.fullName ?? "User" })}
    >
      {initials ?? "?"}
    </div>
  );

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex align-items-center gap-2" title={t("logoTitle")}>
              <img src={logo} alt={t("brandAlt")} width="150" height="100" className="rounded" />
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={NavLink} to="/">
                {t("home")}
              </Nav.Link>

              <Nav.Link as={NavLink} to="/services">
                {t("planServices")}
              </Nav.Link>

              {!user ? (
                <>
                  <Nav.Link as={NavLink} to="/login">
                    {t("login")}
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/register">
                    {t("registerNav")}
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/admin-login">
                    {t("admin")}
                  </Nav.Link>
                </>
              ) : (
                <>
                  {user.role === "admin" && (
                    <Nav.Link as={NavLink} to="/admin">
                      {t("navigationBar")}
                    </Nav.Link>
                  )}

                  {user.role === "user" && (
                    <Nav.Link as={NavLink} to="/dashboard">
                      {t("navigationBar")}
                    </Nav.Link>
                  )}

                  <Nav.Link
                    onClick={() => setShowProfileModal(true)}
                    className="d-flex align-items-center p-0 ms-2"
                    style={{ cursor: "pointer" }}
                    title={t("openProfile")}
                    aria-label={t("openProfile")}
                  >
                    {avatarElement}
                  </Nav.Link>

                  <Nav.Link onClick={handleLogout} className="text-danger ms-2">
                    {t("logout")}
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {user && <ProfileModal show={showProfileModal} onHide={() => setShowProfileModal(false)} />}
    </>
  );
};

export default NavigationBar;