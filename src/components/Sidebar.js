import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">WasteTracker</div>
      <Link to="/user-dashboard" className="sidebar-link">User Dashboard</Link>
      <Link to="/manager-dashboard" className="sidebar-link">Manager Dashboard</Link>
      <Link to="/cleaner-dashboard" className="sidebar-link">Cleaner Dashboard</Link>
    </div>
  );
};

export default Sidebar;
