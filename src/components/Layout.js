import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';
import './Sidebar.css';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-container">
      <Sidebar collapsed={collapsed} toggleSidebar={() => setCollapsed(!collapsed)} />

      {/* Navbar */}
      <div className="navbar">
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>

        <span className="navbar-title">Welcome to Workflow Engine</span>

        <div className="navbar-right">
          <img src="/avatar.png" alt="User Avatar" className="avatar" />
          <button className="logout-btn">Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
