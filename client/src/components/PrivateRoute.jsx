// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  return user?.token ? children : <Navigate to="/login" />;
}

export default PrivateRoute;