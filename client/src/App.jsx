import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import ServicesPromo from "./components/ServicesPromo";
import Home from './pages/Home';
import Services from './pages/Services';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Login from './pages/Login';

function App() {
  return (
    <>
      <NavigationBar />
      <ServicesPromo />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/services"   element={<Services />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;