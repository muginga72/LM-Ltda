// src/components/roomrental/RoomManager.jsx
import React, { useEffect, useState, useContext } from "react";
import { Button, Table, Spinner, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { fetchRooms, createRoom } from "../../api/roomsApi";
import RoomForm from "./RoomForm";

function RoomManager() {
  const { user } = useContext(AuthContext);
  const token = user?.token || localStorage.getItem("authToken") || null;
  const role = user?.role || (() => {
    if (!token) return null;
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      return payload.role || payload.roles || null;
    } catch {
      return null;
    }
  })();
  const isAdmin = role === "admin";

  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchRooms(token);
        if (!mounted) return;
        setRooms(Array.isArray(data) ? data : (data.rooms || []));
      } catch (err) {
        console.error("fetchRooms error", err);
        if (err.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("authToken");
          setTimeout(() => navigate("/login"), 700);
        } else {
          setError(err.message || "Failed to load rooms.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [token, navigate]);

  function handleCreated(newRoom) {
    setRooms((prev) => [newRoom, ...prev]);
    setShowAddModal(false);
    setUploadProgress(0);
  }

  async function handleCreateWithFormData(formData, onProgress) {
    setError("");
    setUploadProgress(0);
    try {
      const created = await createRoom(formData, token, true, { useCredentials: false, onProgress });
      handleCreated(created);
    } catch (err) {
      console.error("createRoom error", err);
      if (err.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 700);
      } else {
        setError(err.message || "Failed to create room.");
      }
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Rooms</h4>
        <div>
          <Button
            variant="outline-primary"
            onClick={() => setShowAddModal(true)}
            disabled={!isAdmin}
            title={!isAdmin ? "Admin only" : "Add room"}
          >
            ➕ Room
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-4"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
              <th>Price</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No rooms found</td>
              </tr>
            ) : (
              rooms.map((r) => (
                <tr key={r.id || r._id || r.roomTitle || r.name}>
                  <td>{r.roomTitle || r.name}</td>
                  <td>{r.roomCapacity ?? r.capacity ?? "-"}</td>
                  <td>{(r.pricePerNight && r.pricePerNight.amount) ? `${r.pricePerNight.amount} ${r.pricePerNight.currency || ""}` : "-"}</td>
                  <td>{new Date(r.createdAt || r.created_at || Date.now()).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RoomForm
            onCreated={(created) => handleCreated(created)}
            onCancel={() => setShowAddModal(false)}
            // Provide a helper that the form can call to perform the upload with progress
            createRoomWithUpload={handleCreateWithFormData}
            isAdmin={isAdmin}
            token={token}
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

export default RoomManager;