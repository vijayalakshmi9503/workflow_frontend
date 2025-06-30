// src/layouts/AppLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
// import '../components/Sidebar.css';

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  return (
    <div className={`app-container ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} />

      <div className="navbar">
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
        <div className="navbar-right">
          <img src="/avatar.jpg" alt="User" className="avatar" />
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
