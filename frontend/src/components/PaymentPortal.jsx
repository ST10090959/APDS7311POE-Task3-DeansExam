import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import './PaymentPortal.css';

const PaymentPortal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [userId, setUserId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardType, setCardType] = useState('');

  // Format card number
  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const paymentData = {
      userId,
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryDate,
      cvv,
      amount: parseFloat(amount),
      paymentMethod,
      cardType,
    };

    console.log("🔍 Sending Payment Data:", paymentData);

    try {
      const { data } = await axiosInstance.post('/payments/payment', paymentData);
      console.log('Payment Response:', data);

      setSuccess('Payment successful!');
      setUserId('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setAmount('');
      setPaymentMethod('');
      setCardType('');

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Payment Error:', error);
      if (error.response) {
        console.error('🔍 Server Response:', error.response.data);
        setError(error.response.data.message || 'Transaction failed. Please check your details.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/'); // Navigate to AuthForm page after logout
  };

  return (
    <div className="payment-portal-container">
      {/* Navbar */}
      <nav className="navbar">
        <span className="navbar-logo">Payment Portal</span>
        <div 
          className="logout-btn cursor-pointer flex items-center gap-2 text-red-500 hover:text-red-400 transition"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </div>
      </nav>

      <div className="payment-card">
        <h1>Payment Portal</h1>

        <form onSubmit={handlePayment}>
          {/* User ID Field */}
          <div className="form-field">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              placeholder="Enter Your User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          {/* Card Number Field */}
          <div className="form-field">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              placeholder="Enter Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength="19"
              required
            />
          </div>

          {/* Expiry Date Field */}
          <div className="form-field">
            <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
            <input
              type="text"
              id="expiryDate"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              maxLength="5"
              required
            />
          </div>

          {/* CVV Field */}
          <div className="form-field">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              placeholder="Enter CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength="3"
              required
            />
          </div>

          {/* Amount Field */}
          <div className="form-field">
            <label htmlFor="amount">Amount (USD $)</label>
            <input
              type="number"
              id="amount"
              placeholder="Amount in USD"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.01"
              step="0.01"
            />
          </div>

          {/* Payment Method Field */}
          <div className="form-field">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
            </select>
          </div>

          {/* Card Type Field */}
          <div className="form-field">
            <label htmlFor="cardType">Card Type</label>
            <select
              id="cardType"
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              required
            >
              <option value="">Select Card Type</option>
              <option value="Visa">Visa</option>
              <option value="MasterCard">MasterCard</option>
              <option value="American Express">American Express</option>
              <option value="Discover">Discover</option>
              <option value="Diners Club">Diners Club</option>
            </select>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}
          {/* Success Message */}
          {success && <div className="success-message">{success}</div>}

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Submit Payment'}
          </button>
        </form>

        {/* Help Section */}
        <div className="help-section">
          <h3>Need Help?</h3>
          <p>If you need assistance with your payment, please contact our support team at <a href="mailto:unisafeapp7319.com">unisafeapp7319.com</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPortal;
