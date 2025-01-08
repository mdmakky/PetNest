import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, TextField, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; 
import { toast } from "react-toastify";
import "./CheckOut.css";

const CheckOut = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { product, seller, quantity: initialQuantity, sellerId } = location.state || {};

  const [sellerData, setSellerData] = useState(seller || null); 
  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [totalCost, setTotalCost] = useState(product?.price * quantity || 0);
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 3))
  );

  useEffect(() => {
    if (sellerId) {
      const fetchSeller = async (sellerId) => {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You need to be logged in to view seller information.");
          return;
        }

        try {
          const response = await fetch(`http://localhost:3000/api/user/getUserById/${sellerId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            setSellerData(data.user);
          } else {
            toast.error(data.message || "Failed to fetch seller details.");
          }
        } catch (error) {
          console.error("Error fetching seller:", error);
          toast.error("Failed to fetch seller details.");
        }
      };

      fetchSeller(sellerId);
    }
  }, [sellerId]);

  const handleQuantityChange = (e) => {
    let qty = parseInt(e.target.value, 10);
    if (qty < 1) {
      qty = 1; 
    }
    setQuantity(qty);
    setTotalCost(qty * product.price);
  };

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/checkOut/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          sellerId: sellerData._id,
          quantity,
          totalCost,
          purchaseDate,
          deliveryDate,
        }),
      });

      const result = await response.json();
      if (result.success) {
        const removeResponse = await fetch("http://localhost:3000/api/cart/removeToCart", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: product._id }),
        });

        const removeData = await removeResponse.json();

        if (removeData.success) {
          toast.success("Order confirmed successfully!");
          navigate("/cart"); 
        } else {
          toast.error(removeData.message || "Failed to remove the product from cart.");
        }
      } else {
        toast.error(result.message || "Failed to confirm the order.");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      toast.error("Failed to confirm the order.");
    }
  };

  const handleClose = () => {
    navigate(-1); 
  };

  if (!product || !sellerData) {
    return <p>Product or seller details are missing.</p>;
  }

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <IconButton className="close-btn" onClick={handleClose}>
          <CloseIcon />
        </IconButton>

        <h2>Checkout</h2>
        <div className="checkout-section">
          <h3>Product Details</h3>
          <p>Name: {product.productName}</p>
          <p>Price: Tk {product.price}</p>
          <p>Seller: {sellerData.name}</p> 
        </div>

        <div className="checkout-section">
          <h3>Order Details</h3>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            fullWidth
            margin="normal"
          />
          <p>Total Cost: <strong>Tk {totalCost}</strong></p>
          <p>Purchase Date: {purchaseDate.toDateString()}</p>
          <p>Delivery Date: {deliveryDate.toDateString()}</p>
        </div>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleConfirmOrder}
        >
          Confirm Order
        </Button>
      </div>
    </div>
  );
};

export default CheckOut;
