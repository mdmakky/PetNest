import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // If you want to show a notification after removal
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract transactionId and productId from the URL query parameters
  const params = new URLSearchParams(location.search);
  const transactionId = params.get('tran_id');
  const productId = params.get('product_id');  // Get the productId from the query parameter

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (transactionId && productId) {
      console.log('Transaction ID:', transactionId);
      console.log('Product ID:', productId);

      // Remove product from cart after payment success
      const removeProductFromCart = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:3000/api/cart/removeToCart", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId: productId }) // Pass the product ID that was bought
          });

          const data = await response.json();

          if (data.success) {
            toast.success('Product removed from cart!');
            navigate('/');  // Redirect to home page after success
          } else {
            setError(data.message || "Failed to remove the product from cart.");
            toast.error('Failed to remove product from cart.');
          }
        } catch (err) {
          setError("Error removing product from cart.");
          console.error("Error:", err);
          toast.error('Error removing product from cart.');
        } finally {
          setLoading(false);
        }
      };

      // Call the function to remove the product
      removeProductFromCart();
    }
  }, [transactionId, productId, navigate]);

  return (
    <div className="success-container">
      <div className="success-card">
        <h1 className="success-title">🎉 Payment Successful! 🎉</h1>
        <p className="success-message">
          Thank you for your purchase. Your payment has been processed successfully. 💸
        </p>

        {loading && <p>Removing product from cart...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="button-container">
          <Link to="/" className="go-home-btn">🏠 Go to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
