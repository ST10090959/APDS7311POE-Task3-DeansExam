import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import EmployeeDash from './components/EmployeeDash';  
import PaymentPortal from './components/PaymentPortal';
import './App.css';
import './style.scss';
import AdminDash from './components/AdminDash';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Auth route (Login/Signup) */}
          <Route path="/" element={<AuthForm />} />

          {/* Dashboard route (for customer) */}
          <Route 
            path="/dashboard" 
            element={token ? <DelayedNavigation component={Dashboard} /> : <Navigate to="/" />} 
          />

          {/* Employee Dashboard route */}
          <Route 
            path="/employee-dashboard" 
            element={token ? <DelayedNavigation component={EmployeeDash} /> : <Navigate to="/" />} 
          />

          {/* Admin Dashboard route */}
          <Route 
            path="/admin-dashboard" 
            element={token ? <DelayedNavigation component={AdminDash} /> : <Navigate to="/" />} 
          />

          {/* Payment Portal route */}
          <Route 
            path="/payment-portal" 
            element={token ? <DelayedNavigation component={PaymentPortal} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

// Helper Component: Delays navigation slightly to allow React to process changes
const DelayedNavigation = ({ component: Component }) => {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 500); // Delay navigation by 500ms

    return () => clearTimeout(timer);
  }, []);

  return shouldRender ? <Component /> : <div>Loading...</div>;
};

export default App;
