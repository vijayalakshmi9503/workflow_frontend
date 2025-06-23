import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [employeeNo, setEmployeeNo] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!employeeNo) {
      newErrors.employeeNo = 'Employee Number is required';
    } else if (!/^\d{5,}$/.test(employeeNo)) {
      newErrors.employeeNo = 'Invalid Employee Number format';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (validate()) {
      try {
        const response = await fetch('http://10.180.5.64:8080/ldapcon/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeNo, password }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          if (typeof onLoginSuccess === 'function') {
            onLoginSuccess(data.user); // Pass user info to parent
          }
          navigate('/dashboard');
        } else {
          setApiError(data.message || 'Login failed. Please check your credentials.');
        }
      } catch (err) {
        console.error('Login error:', err);
        setApiError('Server error. Please try again later.');
      }
    }
  };
  
  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p>Please log in to your account</p>

        <input
          type="text"
          placeholder="Employee Number"
          value={employeeNo}
          onChange={(e) => {
            setEmployeeNo(e.target.value);
            setErrors((prev) => ({ ...prev, employeeNo: '' }));
          }}
        />
        {errors.employeeNo && <p className="error">{errors.employeeNo}</p>}

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

        {apiError && <p className="error">{apiError}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
