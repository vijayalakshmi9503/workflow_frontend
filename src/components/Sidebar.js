import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaHome, FaUserFriends, FaCog } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const menuItems = [
    { name: 'New Request', icon: <FaHome />, path: '/dashboard' },
    { name: 'My Request', icon: <FaUserFriends />, path: '/users' },
    { name: 'Approvals', icon: <FaCog />, path: '/settings' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src="/cdac.jpg" alt="Logo" className="logo" />
        {!collapsed && <div className="logo-text">Workflow Engine</div>}
      </div>
      <div className="sidebar-divider" />
      <ul className="menu">
        {menuItems.map((item, i) => (
          <li key={i}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'menu-item active' : 'menu-item'
              }
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="text">{item.name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
