import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import AdminDashboard from "./dashbords/AdminDashboard";
import OrganizerDashboard from "./dashbords/OrganizerDashboard";
import AttendeeDashboard from "./dashbords/AttendeeDashboard";
import EventDashboard from "./dashbords/EventDashboard";
import Home from "./dashbords/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
        <Route path="/attendee-dashboard" element={<AttendeeDashboard />} />
        <Route path="/home" element={<Home />} /> 
        <Route path="/events" element={<EventDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;