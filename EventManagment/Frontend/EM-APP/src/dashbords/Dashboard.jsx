import React from "react";
import AdminDashboard from "./AdminDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
//import AttendeeDashboard from "./AttendeeDashboard";
import Home from "./Home";

const Dashboard = ({ role }) => {
  return (
    <div className="dashboard-container">
      {role === "ADMIN" && <AdminDashboard />}
      {role === "ORGANIZER" && <OrganizerDashboard />}
      {role === "ATTENDEE" && <Home/>}
    </div>
  );
};

export default Dashboard;