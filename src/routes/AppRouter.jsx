// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppLayout from '../layouts/AppLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Settings from '../pages/Settings';
import Approvals from '../pages/Approvals';
import WorkflowBuilder from '../pages/WorkflowBuilder';
import DragDropBuilder from '../components/DragDropBuilder';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
      />
      
      {isAuthenticated && (
        <Route path="/*" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="workflow-builder" element={<WorkflowBuilder />} />
          <Route path="edit-workflow/:id" element={<DragDropBuilder />} />
          <Route path="dragdroppable" element={<DragDropBuilder />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      )}

      {!isAuthenticated && (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes> 
  );
};

export default AppRouter;
