import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setUsers(res.data);
    };
    fetchUsers();
  }, [user]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>
      <h4>All Users</h4>
      <ul>
        {users.map(u => (
          <li key={u._id}>
            {u.name} ({u.email}) - Role: {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;