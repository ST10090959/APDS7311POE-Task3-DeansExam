import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import './AuthForm.css';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    const targetText = "Welcome to UniSafe";
    let index = 0;
    let typingTimeout;

    const typeText = () => {
      if (index < targetText.length) {
        setTypedText((prev) => prev + targetText.charAt(index));
        index += 1;
        typingTimeout = setTimeout(typeText, 100);
      }
    };

    typeText();

    return () => clearTimeout(typingTimeout);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔹 Attempting login with User ID:', userId);

      const { data } = await axiosInstance.post('/auth/login', { userId, password });

      console.log('Login Response:', data);

      if (data && data.token && data.user && data.user.id) {
        console.log(`User ID received: ${data.user.id}`);
        console.log(`Token received: ${data.token}`);

        // Save token in localStorage BEFORE navigating
        localStorage.setItem('token', data.token);
        console.log("Token stored in localStorage");

        // Delay navigation slightly to allow state updates
        setTimeout(() => {
          if (data.user.id.startsWith('EMP')) {
            console.log('Navigating to Employee Dashboard...');
            navigate('/employee-dashboard');
          } else if (data.user.id.startsWith('AD')) {
            console.log('Navigating to Admin Dashboard...');
            navigate('/admin-dashboard'); 
          } else {
            console.log('Navigating to User Dashboard...');
            navigate('/dashboard');
          }
        }, 500); // Small delay for smoother navigation

      } else {
        console.log('Login failed. No valid user data received.');
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError('Invalid credentials or network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">{typedText}</h1>
        <form onSubmit={handleLogin} className="form">
          <div className="input-group">
            <label htmlFor="userId" className={userId ? 'active' : ''}>
              User ID<span className="required">*</span>
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your User ID"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className={password ? 'active' : ''}>
              Password<span className="required">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
