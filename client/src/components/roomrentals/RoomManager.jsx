// src/components/roomrental/RoomManager.jsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import { Button, Alert, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../contexts/AuthContext";
import { fetchRooms, createRoom, updateRoom, deleteRoom } from "../../api/roomsApi";
import RoomForm from "./RoomForm";
import RoomCard from "./RoomCard";
import RoomListItem from "./RoomListItem";

function parseRoleFromToken(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.role || payload.roles || null;
  } catch {
    return null;
  }
}

function localeForLang(lang) {
  if (!lang) return "en-GB";
  const l = lang.toLowerCase();
  if (l.startsWith("fr")) return "fr-FR";
  if (l.startsWith("pt")) return "pt-PT";
  return "en-GB";
}

export function formatEuropeanDateTime(value, lang) {
  if (!value) return "";
  const locale = localeForLang(lang);
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function RoomManager() {
  const { user } = useContext(AuthContext);
  const token = user?.token || localStorage.getItem("authToken") || null;
  const role = user?.role || parseRoleFromToken(token);
  const isAdmin = role === "admin";

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAuthError = useCallback(
    (err) => {
      if (err && err.status === 401) {
        setError(t("sessionExpired"));
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 700);
      } else {
        setError(err?.message || t("errorOccurred"));
      }
    },
    [navigate, t]
  );

  // Load rooms on mount (and when token changes)
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchRooms(token);
        if (!mounted) return;
        setRooms(Array.isArray(data) ? data : data.rooms || []);
      } catch (err) {
        console.error("fetchRooms error", err);
        handleAuthError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token, handleAuthError]);

  // Open modal for creating a new room
  function openCreateModal() {
    setEditingRoom(null);
    setUploadProgress(0);
    setShowModal(true);
  }

  // Open modal for editing an existing room
  function startEdit(room) {
    setEditingRoom(room);
    setUploadProgress(0);
    setShowModal(true);
  }

  // Called after a room is created
  function handleCreated(newRoom) {
    setRooms((prev) => [newRoom, ...prev]);
    setShowModal(false);
    setUploadProgress(0);
  }

  // Called after a room is updated
  function handleUpdated(updatedRoom) {
    setRooms((prev) => prev.map((r) => (r._id === updatedRoom._id ? updatedRoom : r)));
    setShowModal(false);
    setEditingRoom(null);
    setUploadProgress(0);
  }

  // Create with FormData (used by RoomForm when uploading files)
  async function handleCreateWithFormData(formData, onProgress) {
    setError("");
    setUploadProgress(0);
    try {
      const created = await createRoom(formData, token, true, {
        useCredentials: false,
        onProgress: (evt) => {
          if (evt && evt.total) {
            const pct = Math.round((evt.loaded / evt.total) * 100);
            setUploadProgress(pct);
            if (typeof onProgress === "function") onProgress(pct);
          }
        },
      });
      handleCreated(created);
    } catch (err) {
      console.error("createRoom error", err);
      handleAuthError(err);
    } finally {
      setUploadProgress(0);
    }
  }

  // Update with FormData (used by RoomForm when editing with files)
  async function handleUpdateWithFormData(id, formData, onProgress, appendImages = true) {
    setError("");
    setUploadProgress(0);
    try {
      const idWithQuery = `${id}?appendImages=${appendImages ? "true" : "false"}`;
      const result = await updateRoom(idWithQuery, formData, token, true, {
        useCredentials: false,
        onProgress: (evt) => {
          if (evt && evt.total) {
            const pct = Math.round((evt.loaded / evt.total) * 100);
            setUploadProgress(pct);
            if (typeof onProgress === "function") onProgress(pct);
          }
        },
      });
      const updated = result.room || result;
      handleUpdated(updated);
    } catch (err) {
      console.error("updateRoom error", err);
      handleAuthError(err);
    } finally {
      setUploadProgress(0);
    }
  }

  // Delete a room
  async function handleDelete(id) {
    if (!window.confirm(t("deleteConfirm"))) return;
    setError("");
    try {
      // optimistic update
      const previous = rooms;
      setRooms((prev) => prev.filter((r) => r._id !== id));
      await deleteRoom(id, token, { useCredentials: false });
    } catch (err) {
      console.error("deleteRoom error", err);
      handleAuthError(err);
      // rollback
      try {
        const data = await fetchRooms(token);
        setRooms(Array.isArray(data) ? data : data.rooms || []);
      } catch (e) {
        // ignore
      }
    }
  }

  // View handler (navigate to room detail)
  function handleView(room) {
    if (!room?._id) return;
    navigate(`/rooms/${room._id}`);
  }

  // Helper to render grid of RoomCard components
  function renderCards() {
    if (!rooms || rooms.length === 0) {
      return <div className="text-muted">{t("noRoomsFound")}</div>;
    }
    return (
      <div className="row">
        {rooms.map((r) => (
          <div key={r._id} className="col-md-4 mb-3">
            <RoomCard
              room={r}
              onEdit={startEdit}
              onDelete={handleDelete}
              onView={handleView}
              isAdmin={isAdmin}
              // pass formatting helper so child components can display dates in European format
              formatDate={(value) => formatEuropeanDateTime(value, i18n.language)}
            />
          </div>
        ))}
      </div>
    );
  }

  // Helper to render compact list (optional)
  function renderList() {
    if (!rooms || rooms.length === 0) {
      return <div className="text-muted">{t("noRoomsFound")}</div>;
    }
    return (
      <div className="list-group">
        {rooms.map((r) => (
          <RoomListItem
            key={r._id}
            room={r}
            onEdit={startEdit}
            onDelete={handleDelete}
            isAdmin={isAdmin}
            formatDate={(value) => formatEuropeanDateTime(value, i18n.language)}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>{t("rooms")}</h4>
        <div>
          <Button
            variant="outline-primary"
            onClick={openCreateModal}
            disabled={!isAdmin}
            title={!isAdmin ? t("adminOnly") : t("addRoom")}
          >
            ➕ {t("room")}
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <>
          {/* Grid of cards */}
          {renderCards()}

          {/* Optional compact list below (uncomment if you prefer list view) */}
          {/* {renderList()} */}
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingRoom ? t("editRoom") : t("addNewRoom")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RoomForm
            token={token}
            isAdmin={isAdmin}
            initialData={editingRoom || null}
            onCreated={(created) => handleCreated(created)}
            onUpdated={(updated) => handleUpdated(updated)}
            createRoomWithUpload={(formData, onProgress) => handleCreateWithFormData(formData, onProgress)}
            updateRoomWithUpload={(id, formData, onProgress, appendImages = true) =>
              handleUpdateWithFormData(id, formData, onProgress, appendImages)
            }
            // pass formatting helper to RoomForm if it needs to show dates
            formatDate={(value) => formatEuropeanDateTime(value, i18n.language)}
          />

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-3">
              <div>
                {t("uploadProgress")}: {uploadProgress}%
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}