// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../contexts/AuthContext";
// import AdminUserTable from "../components/admin/adminTables/AdminUserTable";
// import AdminRequestedServicesTable from "../components/admin/adminTables/AdminRequestedServicesTable.jsx";
// import AdminScheduledServicesTable from "../components/admin/adminTables/AdminScheduledServicesTable.jsx";
// import AdminSharedServicesTable from "../components/admin/adminTables/AdminSharedServicesTable.jsx";
// import { Container, Spinner, Alert, Button } from "react-bootstrap";
// import AdminAddService from "../components/admin/AdminAddService";
// import ServicesGrid from "../components/ServicesGrid";
// import { fetchServices } from "../api/servicesApi";

// function NewAdminDashboard({ token }) {
//   const { user } = useContext(AuthContext);

//   const [users, setUsers] = useState([]);
//   const [requestedServices, setRequestedServices] = useState([]);
//   const [scheduledServices, setScheduledServices] = useState([]);
//   const [sharedServices, setSharedServices] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [errorUsers, setErrorUsers] = useState("");
//   const [errorRequested, setErrorRequested] = useState("");
//   const [errorScheduled, setErrorScheduled] = useState("");
//   const [errorShared, setErrorShared] = useState("");

//   const [showAddModal, setShowAddModal] = useState(false);
//   const [services, setServices] = useState([]);
//   const [refreshKey, setRefreshKey] = useState(0);

//   // fetch all service-related data
//   useEffect(() => {
//     if (!user?.token) return;
//     const headers = {
//       Authorization: `Bearer ${user.token}`,
//       "Cache-Control": "no-cache",
//     };

//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get("/api/admin/users", { headers });
//         setUsers(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         setErrorUsers("Failed to load user list.");
//       }
//     };

//     const fetchRequested = async () => {
//       try {
//         const res = await axios.get("/api/requests", { headers });
//         setRequestedServices(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Requested services error:", err);
//         setErrorRequested("Failed to load requested services.");
//       }
//     };

//     const fetchScheduled = async () => {
//       try {
//         const res = await axios.get("/api/schedules", { headers });
//         setScheduledServices(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Scheduled services error:", err);
//         setErrorScheduled("Failed to load scheduled services.");
//       }
//     };

//     const fetchShared = async () => {
//       try {
//         const res = await axios.get("/api/shares", { headers });
//         setSharedServices(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Shared services error:", err);
//         setErrorShared("Failed to load shared services.");
//       }
//     };

//     setLoading(true);
//     const promises = [fetchRequested(), fetchScheduled(), fetchShared()];
//     if (user.role === "admin") promises.unshift(fetchUsers());
//     Promise.all(promises).finally(() => setLoading(false));
//   }, [user]);

//   // fetch services for preview grid
//   useEffect(() => {
//     fetchServices()
//       .then(setServices)
//       .catch((err) => console.error("Error fetching services:", err));
//   }, []);

//   const handleServiceCreated = () => setRefreshKey((k) => k + 1);

//   // define handleStatusUpdate for child tables
//   const handleStatusUpdate = (serviceId, newStatus, type) => {
//     if (type === "requested") {
//       setRequestedServices((prev) =>
//         prev.map((s) => (s._id === serviceId ? { ...s, status: newStatus } : s))
//       );
//     } else if (type === "scheduled") {
//       setScheduledServices((prev) =>
//         prev.map((s) => (s._id === serviceId ? { ...s, status: newStatus } : s))
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" />
//       </Container>
//     );
//   }

//   return (
//     <>
//       <Container style={{ padding: "2rem" }}>
//         <h2 className="mb-2 text-center">
//           {user?.role === "admin" ? "Admin Dashboard" : "User Dashboard"}
//         </h2>
//         <h5 className="text-center mb-4">Welcome, {user?.fullName}</h5>
//         <p>Email: {user?.email}</p>
//         <p>Role: {user?.role}</p>

//         <Container className="py-2">
//           <div className="d-flex justify-content-between align-items-center mb-2">
//             <Button
//               variant="outline-success"
//               onClick={() => setShowAddModal(true)}
//             >
//               ➕ Service
//             </Button>
//           </div>

//           <AdminAddService
//             show={showAddModal}
//             onHide={() => setShowAddModal(false)}
//             onCreated={handleServiceCreated}
//             token={token}
//           />
//         </Container>

//         <div className="container py-4">
//           <div className="row mb-4">
//             <div className="col-md-12">
//               <h3 className="mb-3 text-center">Preview Current Services</h3>
//               {services.length === 0 ? (
//                 <Alert variant="info">No services available.</Alert>
//               ) : (
//                 <ServicesGrid services={services} />
//               )}
//             </div>
//           </div>
//         </div>

//         <hr />

//         <h4 className="m-3 text-center">Customer Service Overview</h4>

//         {user?.role === "admin" && (
//           <>
//             {errorUsers && <Alert variant="danger">{errorUsers}</Alert>}
//             <AdminUserTable users={users} />
//           </>
//         )}

//         {errorRequested && <Alert variant="danger">{errorRequested}</Alert>}
//         <AdminRequestedServicesTable
//           services={requestedServices}
//           token={user?.token}
//           onStatusUpdate={handleStatusUpdate}
//         />

//         {errorScheduled && <Alert variant="danger">{errorScheduled}</Alert>}
//         <AdminScheduledServicesTable
//           services={scheduledServices}
//           token={user?.token}
//           onStatusUpdate={handleStatusUpdate}
//         />

//         {errorShared && <Alert variant="danger">{errorShared}</Alert>}
//         <AdminSharedServicesTable services={sharedServices} />

//         <hr />
//       </Container>
//       <footer className="text-center py-2">
//         <small>
//           &copy; {new Date().getFullYear()} LM Ltd. All rights reserved.
//         </small>
//       </footer>
//     </>
//   );
// }

// export default NewAdminDashboard;


import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import AdminUserTable from "../components/admin/adminTables/AdminUserTable";
import AdminRequestedServicesTable from "../components/admin/adminTables/AdminRequestedServicesTable.jsx";
import AdminScheduledServicesTable from "../components/admin/adminTables/AdminScheduledServicesTable.jsx";
import AdminSharedServicesTable from "../components/admin/adminTables/AdminSharedServicesTable.jsx";
import { Container, Spinner, Alert, Button } from "react-bootstrap";
import AdminAddService from "../components/admin/AdminAddService";
import ServicesGrid from "../components/ServicesGrid";
import { fetchServices } from "../api/servicesApi";

function NewAdminDashboard({ token }) {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [requestedServices, setRequestedServices] = useState([]);
  const [scheduledServices, setScheduledServices] = useState([]);
  const [sharedServices, setSharedServices] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorUsers, setErrorUsers] = useState("");
  const [errorRequested, setErrorRequested] = useState("");
  const [errorScheduled, setErrorScheduled] = useState("");
  const [errorShared, setErrorShared] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!user?.token) return;
    const headers = {
      Authorization: `Bearer ${user.token}`,
      "Cache-Control": "no-cache",
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users", { headers });
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setErrorUsers("Failed to load user list.");
      }
    };

    const fetchRequested = async () => {
      try {
        const res = await axios.get("/api/requests", { headers });
        setRequestedServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Requested services error:", err);
        setErrorRequested("Failed to load requested services.");
      }
    };

    const fetchScheduled = async () => {
      try {
        const res = await axios.get("/api/schedules", { headers });
        setScheduledServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Scheduled services error:", err);
        setErrorScheduled("Failed to load scheduled services.");
      }
    };

    const fetchShared = async () => {
      try {
        const res = await axios.get("/api/shares", { headers });
        setSharedServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Shared services error:", err);
        setErrorShared("Failed to load shared services.");
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      const promises = [fetchRequested(), fetchScheduled(), fetchShared()];
      if (user.role === "admin") promises.unshift(fetchUsers());
      await Promise.all(promises);
      setLoading(false);
    };

    fetchAll();
  }, [user]);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  const handleServiceCreated = () => {
    fetchServices()
      .then(setServices)
      .catch((err) => console.error("Error refreshing services:", err));
    setShowAddModal(false);
  };

  const handleStatusUpdate = (serviceId, newStatus, type) => {
    if (type === "requested") {
      setRequestedServices((prev) =>
        prev.map((s) => (s._id === serviceId ? { ...s, status: newStatus } : s))
      );
    } else if (type === "scheduled") {
      setScheduledServices((prev) =>
        prev.map((s) => (s._id === serviceId ? { ...s, status: newStatus } : s))
      );
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <>
      <Container style={{ padding: "2rem" }}>
        <h2 className="mb-2 text-center">
          {user?.role === "admin" ? "Admin Dashboard" : "User Dashboard"}
        </h2>
        <h5 className="text-center mb-4">Welcome, {user?.fullName}</h5>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>

        <Container className="py-2">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Button
              variant="outline-success"
              onClick={() => setShowAddModal(true)}
            >
              ➕ Service
            </Button>
          </div>

          <AdminAddService
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
            onCreated={handleServiceCreated}
            token={token}
          />
        </Container>

        <div className="container py-4">
          <div className="row mb-4">
            <div className="col-md-12">
              <h3 className="mb-3 text-center">Preview Current Services</h3>
              {services.length === 0 ? (
                <Alert variant="info">No services available.</Alert>
              ) : (
                <ServicesGrid services={services} />
              )}
            </div>
          </div>
        </div>

        <hr />

        <h4 className="m-3 text-center">Customer Service Overview</h4>

        {user?.role === "admin" && (
          <>
            {errorUsers && <Alert variant="danger">{errorUsers}</Alert>}
            <AdminUserTable users={users} />
          </>
        )}

        {errorRequested && <Alert variant="danger">{errorRequested}</Alert>}
        <AdminRequestedServicesTable
          services={requestedServices}
          token={user?.token}
          onStatusUpdate={handleStatusUpdate}
        />

        {errorScheduled && <Alert variant="danger">{errorScheduled}</Alert>}
        <AdminScheduledServicesTable
          services={scheduledServices}
          token={user?.token}
          onStatusUpdate={handleStatusUpdate}
        />

        {errorShared && <Alert variant="danger">{errorShared}</Alert>}
        <AdminSharedServicesTable services={sharedServices} />

        <hr />
      </Container>
      <footer className="text-center py-2">
        <small>
          &copy; {new Date().getFullYear()} LM Ltd. All rights reserved.
        </small>
      </footer>
    </>
  );
}

export default NewAdminDashboard;