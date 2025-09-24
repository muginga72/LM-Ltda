import React, { createContext, useState } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const signup = async (name, email, password, role) => {
    const data = await authService.signup(name, email, password, role);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  // const logout = () => {
  //   authService.logout();
  //   setUser(null);
  // };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
