import React, { useEffect, useState } from "react";
import { Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import "react-toastify/dist/ReactToastify.css";
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/api/cart/getCart", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setCart(data.cart);
        } else {
          toast.error(data.message || "Failed to load cart");
        }
      } catch (error) {
        toast.error("Error fetching cart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/cart/removeToCart", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.cart);
        toast.success("Product removed from cart!");
        setTimeout(() => {
            window.location.reload();
          },2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error removing product.");
    }
  };

  const handleBuyNow = (productId) => {
    navigate(`/checkout/${productId}`);
  };

  return (
    <div>
        <NavBar />

        <div className="cart-container">
      <Typography variant="h4" gutterBottom className="cart-header">
        Your Cart
      </Typography>

      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <div>
          {cart && cart.items.length > 0 ? (
            cart.items.map((item) => (
              <div className="cart-item" key={item.productId._id}>
                <img
                  src={item.productId.productImage}
                  alt={item.productId.productName}
                />
                <div className="cart-item-details">
                  <Typography variant="h6">{item.productId.productName}</Typography>
                  <p>Price: {item.productId.price} Tk</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="cart-item-actions">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBuyNow(item.productId._id)}
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleRemoveFromCart(item.productId._id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <Typography variant="h6" color="textSecondary" className="cart-empty-message">
              Your cart is empty.
            </Typography>
          )}
        </div>
      )}
    </div>
    </div>
    
  );
};

export default Cart;
