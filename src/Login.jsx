import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const hasMinLength = password.length >= 8;
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const specialCharMatches = password.match(/[^A-Za-z0-9]/g) || [];
      const hasTwoSpecialChars = specialCharMatches.length >= 2;

      if (!hasMinLength) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!hasUpper) {
        newErrors.password = 'Password must contain at least 1 uppercase letter';
      } else if (!hasLower) {
        newErrors.password = 'Password must contain at least 1 lowercase letter';
      } else if (!hasTwoSpecialChars) {
        newErrors.password = 'Password must contain at least 2 special characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Call parent handler to enable sidebar
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess();
      }
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p>Please log in to your account</p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: '' }));
          }}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: '' }));
          }}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
