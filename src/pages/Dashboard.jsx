import React from 'react';
import '../styles/Dashboard.css';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Pending Requests', value: 12, color: '#ff9f43' },
    { label: 'Approved Requests', value: 34, color: '#28c76f' },
    { label: 'Rejected Requests', value: 5, color: '#ea5455' },
    { label: 'Total Workflows', value: 8, color: '#00cfe8' }
  ];

  const recentActivity = [
    { id: 1, activity: 'Submitted Leave Request', date: '2025-06-29' },
    { id: 2, activity: 'Approved Expense Claim', date: '2025-06-28' },
    { id: 3, activity: 'Created Workflow: Onboarding', date: '2025-06-27' }
  ];

  return (
    <div className="dashboard">
      <h2>Welcome {user?.firstName || 'User'} 👋</h2>

      <div className="stats-container">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx} style={{ borderLeft: `5px solid ${stat.color}` }}>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul>
          {recentActivity.map((item) => (
            <li key={item.id}>
              <strong>{item.activity}</strong>
              <span>{item.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
