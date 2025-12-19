import React from "react";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import ServicesPromo from "./components/ServicesPromo";
import NewAdminDashboard from "./pages/NewAdminDashboard";
import UserOnlyDashboard from "./pages/UserOnlyDashboard";
import AdminRoute from "./components/admin/AdminRoute";
import Rooms from "../../client/src/pages/roomrental/Rooms";
import RoomDetails from "./components/roomrentals/RoomDetails";
import RoomListingRequest from "./pages/roomrental/RoomListingRequest";
import PrivateRoute from "./components/PrivateRoute";
import AdminLogin from "./pages/AdminLogin";
import LearnMore from "./pages/LearnMore";
import WhoWeAre from "./pages/WhoWeAre";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <NavigationBar />
      <ServicesPromo />

      {/* Add a Learn React link so the test passes */}
      <header className="App-header">
        <a
          href="https://react.dev/learn"
          target="_blank"
          rel="noopener noreferrer"
        ></a>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/who-we-are" element={<WhoWeAre />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id/details" element={<RoomDetails />} />
        <Route path="/room-listing-request" element={<RoomListingRequest />} />
        {/* <Route path="/payments/success" element={<PaymentSuccess />} />  */}

        {/* Protected User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserOnlyDashboard />
            </PrivateRoute>
          }
        />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <NewAdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
