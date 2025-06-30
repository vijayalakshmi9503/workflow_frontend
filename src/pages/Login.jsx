import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // <-- ADD useLocation
import '../styles/Login.css';
import { loginUser } from '../api/auth';
import { validateLoginForm } from '../utils/validations/loginValidation';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [employeeNo, setEmployeeNo] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // <-- ADD THIS
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard'; // fallback if no prior path

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const { isValid, validationErrors } = validateLoginForm(employeeNo, password);
    setErrors(validationErrors);
    if (!isValid) return;

    setIsLoading(true);
    try {
      const response = await loginUser({ employeeNo, password });

      if (response.status === 'success' && response.data?.user) {
        login(response.data.user);
        navigate(from, { replace: true }); // <-- GO BACK TO PREVIOUS ROUTE
      } else {
        setApiError(response.data?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setApiError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
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

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
