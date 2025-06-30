// src/layouts/AppLayout.jsx
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAvatarClick = () => {
    if (location.pathname === '/profile') {
      navigate(-1); // go back to previous page
    } else {
      navigate('/profile');
    }
  };

  return (
    <div className={`app-container ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} />

      <div className="navbar">
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
        <div className="navbar-right">
          <img
            src="/avatar.jpg"
            alt="User"
            className="avatar"
            onClick={handleAvatarClick}
            style={{ cursor: 'pointer' }}
          />
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
