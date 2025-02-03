import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // Ensure correct API config
import './AdminDash.css'; // Ensure this CSS file exists

const AdminDash = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Ensure email is a Gmail account
    if (!email.endsWith('@gmail.com')) {
      setError('Please enter a valid Gmail address (e.g., example@gmail.com).');
      setLoading(false);
      return;
    }

    const userData = {
      name,
      surname,
      email,
      password,
      role,
    };

    console.log('🔍 Sending User Data:', userData); // Debugging log

    try {
      const { data } = await axiosInstance.post('/auth/create', userData);
      console.log('User Creation Response:', data);

      setSuccess('User successfully created!');
      setName('');
      setSurname('');
      setEmail('');
      setPassword('');
      setRole('');

    } catch (error) {
      console.error('User Creation Error:', error);

      if (error.response) {
        setError(error.response.data.message || 'Failed to create user. Check details.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear user session (modify this based on how authentication is handled)
    localStorage.removeItem('token'); // Example: remove authentication token
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="create-user-container">
      <div className="user-card">
        <h1>Create New User</h1>

        <form onSubmit={handleCreateUser}>
          {/* Name Field */}
          <div className="form-field">
            <label htmlFor="name">First Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Surname Field */}
          <div className="form-field">
            <label htmlFor="surname">Surname</label>
            <input
              type="text"
              id="surname"
              placeholder="Enter Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </div>

          {/* Email Field (Only Gmail Allowed) */}
          <div className="form-field">
            <label htmlFor="email">Email (Gmail Only)</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Gmail Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Dropdown */}
          <div className="form-field">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="customer">Customer</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}
          {/* Success Message */}
          {success && <div className="success-message">{success}</div>}

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating User...' : 'Create User'}
          </button>
        </form>

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

        {/* Help Section */}
        <div className="help-section">
          <h3>Need Help?</h3>
          <p>If you need assistance, please contact our support team at <a href="mailto:unisafeapp7319.com">unisafeapp7319.com</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
