import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaUserFriends,
  FaCheckCircle,
  FaProjectDiagram,
  FaSignInAlt,
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ collapsed }) => {
  const menuItems = [
    { name: 'New Request', icon: <FaHome />, path: '/dashboard' },
    { name: 'My Request', icon: <FaUserFriends />, path: '/users' },
    { name: 'Approvals', icon: <FaCheckCircle />, path: '/approvals' },
    { name: 'Workflow Builder', icon: <FaProjectDiagram />, path: '/dragdroppable' },
    { name: 'Login', icon: <FaSignInAlt />, path: '/login' }, 
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-header">
        <img src="/cdac.jpg" alt="CDAC Logo" className="logo" />
        {!collapsed && <div className="logo-text">Workflow Engine</div>}
      </div>

      <div className="sidebar-divider" />

      {/* Navigation Menu */}
      <ul className="menu">
        {menuItems.map((item, index) => (
          <li key={index}>
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
