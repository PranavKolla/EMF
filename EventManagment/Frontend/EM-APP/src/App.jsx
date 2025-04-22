import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import AdminDashboard from "./dashbords/AdminDashboard";
import OrganizerDashboard from "./dashbords/OrganizerDashboard";

import EventDashboard from "./dashbords/EventDashboard";
import Home from "./dashbords/Home";
import SignUpForm from "./components/SignUpForm";
import BookingDashboard from "./dashbords/BookingDashboard";
import FeedbackDashboard from "./dashbords/FeedbackDashboard"; 
function App() {
  const isAuthenticated = !!localStorage.getItem("jwtToken");

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpForm onCancel={() => window.history.back()} />} /> 
        <Route path="/" element={<LoginForm />} />
        <Route path="/admin-dashboard" element={isAuthenticated ? <AdminDashboard /> : <LoginForm />} />
        <Route path="/organizer-dashboard" element={isAuthenticated ? <OrganizerDashboard /> : <LoginForm />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <LoginForm />} />
        <Route path="/events" element={isAuthenticated ? <EventDashboard /> : <LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/bookings" element={isAuthenticated ? <BookingDashboard /> : <LoginForm />} />
        <Route path="/feedback" element={<FeedbackDashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;