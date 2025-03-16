import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  useEffect(() => {
    const completePurchase = async () => {
      const productId = sessionStorage.getItem("purchasedProductId");
      const quantity = sessionStorage.getItem("purchasedQuantity");
      const token = localStorage.getItem("token");
  
      if (productId && quantity && token) {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/payment/completeOrder",
            { productId, quantity },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
          );
  
          if (response.data.success) {
            sessionStorage.removeItem("purchasedProductId");
            sessionStorage.removeItem("purchasedQuantity");
          }
        } catch (error) {
          console.error("Order completion failed:", error.response?.data);
        }
      }
    };
    completePurchase();
  }, []);

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
