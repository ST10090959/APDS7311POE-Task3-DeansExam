import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import './EmployeeDash.css';

const EmployeeDash = () => {
  const [payments, setPayments] = useState([]);
  const [queriedPayments, setQueriedPayments] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axiosInstance.get('/payments/payments'); // Fetch all payments
        setPayments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Error fetching payments');
        setPayments([]);
      }
    };

    fetchPayments();
  }, []);

  const handleQuery = async (transactionId) => {
    try {
      const response = await axiosInstance.post('/payments/query', { transactionId });

      if (response.status === 200) {
        setQueriedPayments((prev) => ({
          ...prev,
          [transactionId]: true, // Mark payment as queried
        }));
      }
    } catch (error) {
      console.error('Error querying payment:', error);
      alert('Failed to query payment. Please try again.');
    }
  };

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/'); // Navigate to AuthForm page after logout
  };

  return (
    <div className="employees-dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <span className="navbar-logo">Employee Dashboard</span>
        <div 
          className="logout-btn cursor-pointer flex items-center gap-2 text-red-500 hover:text-red-400 transition"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </div>
      </nav>

      {/* Page Heading */}
      <h1 className="heading">Payments Overview</h1>
      {error && <p className="error-message">{error}</p>}

      {/* Payments Table */}
      <div className="table-section">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User ID</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Card Type</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.transactionId}>
                <td>{payment.transactionId || 'N/A'}</td>
                <td>{payment.userId}</td>
                <td>${payment.amount.toFixed(2)}</td>
                <td>{payment.paymentMethod}</td>
                <td>{payment.cardDetails?.cardType || 'N/A'}</td>
                <td>{payment.cardDetails?.expiryDate || 'N/A'}</td>
                <td>{payment.paymentStatus}</td>
                <td>
                  <button
                    onClick={() => handleQuery(payment.transactionId)}
                    className={`query-button ${queriedPayments[payment.transactionId] || payment.queried ? 'queried' : ''}`}
                    disabled={queriedPayments[payment.transactionId] || payment.queried}
                  >
                    {queriedPayments[payment.transactionId] || payment.queried ? 'Payment has been queried' : 'Query'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <p className="empty-message">No payments available.</p>}
      </div>
    </div>
  );
};

export default EmployeeDash;
