import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Services from './pages/Services';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/services"   element={<Services />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/login"      element={<Login />} />
      </Routes>
    </>
  );
}

export default App;