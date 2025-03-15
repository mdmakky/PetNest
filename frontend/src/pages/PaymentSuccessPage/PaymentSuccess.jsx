import React from "react";
import { Link } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  return (
    <div className="success-container">
      <div className="success-card">
        <h1 className="success-title">🎉 Payment Successful! 🎉</h1>
        <p className="success-message">
          Thank you for your purchase. Your payment has been processed
          successfully. 💸
        </p>

        <div className="button-container">
          <Link to="/" className="go-home-btn">
            🏠 Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
