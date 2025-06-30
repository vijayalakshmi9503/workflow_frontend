import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaUserFriends,
  FaCheckCircle,
  FaProjectDiagram,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ collapsed }) => {
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);

  const toggleWorkflow = () => {
    setIsWorkflowOpen(prev => !prev);
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
    { name: 'Dashboard old', icon: <FaHome />, path: '/dashboards' },
    { name: 'My Request', icon: <FaUserFriends />, path: '/users' },
    { name: 'Approvals', icon: <FaCheckCircle />, path: '/approvals' },
    {
      name: 'Workflow',
      icon: <FaProjectDiagram />,
      children: [
        { name: 'Workflow Builder', path: '/workflow-builder' },
        { name: 'Drag & Drop', path: '/dragdroppable' }
      ]
    },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src="/cdac.jpg" alt="CDAC Logo" className="logo" />
        {!collapsed && <div className="logo-text">Workflow Engine</div>}
      </div>

      <div className="sidebar-divider" />

      <ul className="menu">
        {menuItems.map((item, index) => (
          <li key={index}>
            {item.children ? (
              <div className="menu-item submenu-toggle" onClick={toggleWorkflow}>
                <span className="icon">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="text">{item.name}</span>
                    <span className="submenu-icon">
                      {isWorkflowOpen ? <FaChevronDown /> : <FaChevronRight />}
                    </span>
                  </>
                )}
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? 'menu-item active' : 'menu-item'
                }
              >
                <span className="icon">{item.icon}</span>
                {!collapsed && <span className="text">{item.name}</span>}
              </NavLink>
            )}

            {/* Render children if submenu is open */}
            {!collapsed && item.children && isWorkflowOpen && (
              <ul className="submenu">
                {item.children.map((child, subIndex) => (
                  <li key={subIndex}>
                    <NavLink
                      to={child.path}
                      className={({ isActive }) =>
                        isActive ? 'submenu-item active' : 'submenu-item'
                      }
                    >
                      {child.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
