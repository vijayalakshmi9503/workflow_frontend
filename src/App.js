import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.js'
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Login from './Login';
import { FaBars } from 'react-icons/fa';
import './components/Sidebar.css';
import 'antd/dist/reset.css';
import '../src/App.css'
import DragDropBuilder from './components/DragDropBuilder'; // adjust path as needed

const AppLayout = ({ collapsed, setCollapsed, onLogout }) => {
  return (
    <div className={`app-container ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Navbar */}
      <div className="navbar">
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
      

        <div className="navbar-right">
          <img src="/avatar.jpg" alt="User" className="avatar" />
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/Login" element={<Login />} />
             <Route path="/dragdroppable"  element={<DragDropBuilder/>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
         <Route path="/edit-workflow/:id" element={<DragDropBuilder />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // set to false for real use
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" />
              : <Login onLoginSuccess={() => setIsLoggedIn(true)} />
          }
        />

        {isLoggedIn && (
          <Route
            path="/*"
            element={
              <AppLayout
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                onLogout={handleLogout}
              />
            }
          />
        )}

        {!isLoggedIn && (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
