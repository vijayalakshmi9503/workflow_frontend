import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <p>Loading user profile...</p>;

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      <div className="profile-details">
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Employee No:</strong> {user.employeeNo}</p>
        {/* Add more user fields if needed */}
      </div>
    </div>
  );
};

export default Profile;
