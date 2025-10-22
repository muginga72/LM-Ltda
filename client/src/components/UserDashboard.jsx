// components/UserDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import UploadProofModal from "./UploadProofModal";

function UserDashboard({ apiBaseUrl, user }) {
  const API =
    apiBaseUrl || process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`${API}/api/services`)
      .then((r) => setServices(r.data))
      .catch(console.error);
  }, [API, user]);

  // Filter services relevant to this user
  const relevantServices = services.filter(
    (s) =>
      s.requestedBy === user?.id ||
      s.scheduledFor === user?.id ||
      (Array.isArray(s.sharedWith) && s.sharedWith.includes(user?.id))
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Services</h3>
        {/* <small className="text-muted">Logged in as: {user?.email}</small> */}
      </div>

      {relevantServices.length === 0 ? (
        <div className="alert alert-info">
          No requests, schedules, or shared services yet.
        </div>
      ) : (
        <div className="row">
          {relevantServices.map((s) => (
            <div className="col-md-6 mb-3" key={s._id}>
              <div className="card h-100">
                <img
                  src={s.imagePath}
                  className="card-img-top"
                  alt={s.title}
                  style={{ height: 180, objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5>{s.title}</h5>
                  <p className="mb-1 text-muted">{s.description}</p>
                  <p className="mb-1">
                    <strong>${(s.price || 0).toFixed(2)}</strong>
                  </p>
                  <p className="mb-2">Status: {s.status}</p>
                  <div className="mt-auto">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelected(s)}
                    >
                      Send Payment Proof
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <UploadProofModal
        service={selected}
        user={user}
        onHide={() => setSelected(null)}
        refresh={() => {
          axios
            .get(`${API}/api/services`)
            .then((r) => setServices(r.data))
            .catch(console.error);
        }}
      />
    </>
  );
}

export default UserDashboard;
