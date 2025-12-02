// src/components/roomrental/RoomManager.jsx
import React, { useEffect, useState, useContext } from "react";
import { Button, Alert, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { fetchRooms, createRoom, updateRoom, deleteRoom } from "../../api/roomsApi";
import RoomForm from "./RoomForm";
import RoomCard from "./RoomCard";
import ListRoomItem from "./ListRoomItem";

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

export default function RoomManager() {
  const { user } = useContext(AuthContext);
  const token = user?.token || localStorage.getItem("authToken") || null;
  const role = user?.role || parseRoleFromToken(token);
  const isAdmin = role === "admin";

  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load rooms on mount (and when token changes)
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchRooms(token);
        if (!mounted) return;
        // API may return array or { rooms: [...] }
        setRooms(Array.isArray(data) ? data : data.rooms || []);
      } catch (err) {
        console.error("fetchRooms error", err);
        if (err && err.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("authToken");
          setTimeout(() => navigate("/login"), 700);
        } else {
          setError(err?.message || "Failed to load rooms.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token, navigate]);

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

  // Called after a room is created (RoomForm or createRoom path)
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
        onProgress,
      });
      handleCreated(created);
    } catch (err) {
      console.error("createRoom error", err);
      if (err && err.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 700);
      } else {
        setError(err?.message || "Failed to create room.");
      }
    } finally {
      setUploadProgress(0);
    }
  }

  // Update with FormData (used by RoomForm when editing with files)
  async function handleUpdateWithFormData(id, formData, onProgress, appendImages = true) {
    setError("");
    setUploadProgress(0);
    try {
      // appendImages is passed via query string in apiUpdateRoom call
      const idWithQuery = `${id}?appendImages=${appendImages ? "true" : "false"}`;
      const result = await updateRoom(idWithQuery, formData, token, true, { useCredentials: false });
      const updated = result.room || result;
      handleUpdated(updated);
    } catch (err) {
      console.error("updateRoom error", err);
      if (err && err.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 700);
      } else {
        setError(err?.message || "Failed to update room.");
      }
    } finally {
      setUploadProgress(0);
    }
  }

  // Delete a room
  async function handleDelete(id) {
    if (!window.confirm("Delete this room?")) return;
    setError("");
    try {
      await deleteRoom(id, token, { useCredentials: false });
      setRooms((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("deleteRoom error", err);
      if (err && err.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 700);
      } else {
        setError(err?.message || "Failed to delete room.");
      }
    }
  }

  // Helper to render grid of RoomCard components
  function renderCards() {
    if (!rooms || rooms.length === 0) {
      return <div className="text-muted">No rooms found.</div>;
    }
    return (
      <div className="row">
        {rooms.map((r) => (
          <div key={r._id} className="col-md-4 mb-3">
            <RoomCard room={r} onEdit={startEdit} onDelete={handleDelete} isAdmin={isAdmin} />
          </div>
        ))}
      </div>
    );
  }

  // Helper to render compact list (optional)
  function renderList() {
    if (!rooms || rooms.length === 0) {
      return <div className="text-muted">No rooms found.</div>;
    }
    return (
      <div className="list-group">
        {rooms.map((r) => (
          <ListRoomItem key={r._id} room={r} onEdit={startEdit} onDelete={handleDelete} isAdmin={isAdmin} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Rooms</h4>
        <div>
          <Button variant="outline-primary" onClick={openCreateModal} disabled={!isAdmin} title={!isAdmin ? "Admin only" : "Add room"}>
            ➕ Room
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
          <Modal.Title>{editingRoom ? "Edit Room" : "Add New Room"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RoomForm
            token={token}
            isAdmin={isAdmin}
            initialData={editingRoom || null}
            // RoomForm should call onCreated(createdRoom) after successful create
            onCreated={(created) => handleCreated(created)}
            // RoomForm should call onUpdated(updatedRoom) after successful update
            onUpdated={(updated) => handleUpdated(updated)}
            // If RoomForm wants to use the XHR upload path, it can call this helper
            createRoomWithUpload={(formData, onProgress) => handleCreateWithFormData(formData, onProgress)}
            updateRoomWithUpload={(id, formData, onProgress, appendImages = true) =>
              handleUpdateWithFormData(id, formData, onProgress, appendImages)
            }
          />

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-3">
              <div>Upload progress: {uploadProgress}%</div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}