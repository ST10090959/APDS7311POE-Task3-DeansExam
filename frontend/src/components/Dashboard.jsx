import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info, LogOut, CreditCard, History } from "lucide-react";
import './Dashboard.css';

export default function Dashboard() {
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [isWelcomeHidden, setIsWelcomeHidden] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsNavHidden(true);
        setIsWelcomeHidden(true);
      } else {
        setIsNavHidden(false);
        setIsWelcomeHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/");
  };

  const showComingSoon = () => {
    alert("Feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-800">
      {/* 🌟 Fixed Welcome Message */}
      <div className={`welcome-message ${isWelcomeHidden ? 'hide-welcome' : ''}`}>
        Welcome to UniSafe
      </div>

      {/* 🏠 Fixed Top Navigation Bar */}
      <nav className={`bg-gray-900 border-b border-gray-800 fixed w-full z-10 ${isNavHidden ? 'nav-hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text">
            UniSafe
          </h2>
          <ul className="flex gap-10 text-gray-300 font-medium">
            <li
              onClick={showComingSoon}
              className="flex items-center gap-2 cursor-pointer hover:text-green-500 transition"
            >
              <Info size={18} />
              About Us
            </li>
            <li
              onClick={() => navigate("/payment-portal")}
              className="flex items-center gap-2 cursor-pointer hover:text-green-500 transition"
            >
              <CreditCard size={18} />
              Payment Portal
            </li>
            <li
              onClick={showComingSoon}
              className="flex items-center gap-2 cursor-pointer hover:text-green-500 transition"
            >
              <History size={18} />
              Previous Payments
            </li>
            {/* Logout Button */}
            <div className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </div>
          </ul>
        </div>
      </nav>

      {/* 🌟 Main Content */}
      <main className="pt-24 pb-8">
        {/* About Us Card (Not Clickable) */}
        <div className="about-us-card">
          <h3>About Us</h3>
          <p>We are committed to providing a safe and convenient platform for students. Our goal is to enhance student safety and convenience on campus.</p>
        </div>

        {/* Cards Container */}
        <div className="card-container">
          {/* Payment Portal Card */}
          <div className="card" onClick={() => navigate("/payment-portal")}>
            <CreditCard className="icon" />
            <h3>Payment Portal</h3>
            <p>Make secure payments and manage your account.</p>
          </div>

          {/* Previous Payments Card */}
          <div className="card" onClick={showComingSoon}>
            <History className="icon" />
            <h3>Previous Payments</h3>
            <p>View your payment history and transactions.</p>
          </div>
        </div>

        {/* 🌟 Additional Content Section */}
        <div className="additional-content">
          <h3>Need Help?</h3>
          <p>If you have any issues or inquiries, feel free to contact our support team at <a href="mailto:unisafeapp7319.com">unisafeapp7319.com</a>.</p>
        </div>
      </main>
    </div>
  );
}
