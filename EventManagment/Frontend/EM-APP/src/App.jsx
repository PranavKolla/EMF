import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import AdminDashboard from "./dashbords/AdminDashboard";
import OrganizerDashboard from "./dashbords/OrganizerDashboard";
import AttendeeDashboard from "./dashbords/AttendeeDashboard";
import EventDashboard from "./dashbords/EventDashboard";
import Home from "./dashbords/Home";
import SignUpForm from "./components/SignUpForm";

function App() {
  const isAuthenticated = !!localStorage.getItem("jwtToken");

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpForm onCancel={() => window.history.back()} />} /> 
        <Route path="/" element={<LoginForm />} />
        <Route path="/admin-dashboard" element={isAuthenticated ? <AdminDashboard /> : <LoginForm />} />
        <Route path="/organizer-dashboard" element={isAuthenticated ? <OrganizerDashboard /> : <LoginForm />} />
        <Route path="/attendee-dashboard" element={isAuthenticated ? <AttendeeDashboard /> : <LoginForm />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <LoginForm />} />
        <Route path="/events" element={isAuthenticated ? <EventDashboard /> : <LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;