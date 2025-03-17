import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  CircularProgress,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import "react-toastify/dist/ReactToastify.css";
import "./Cart.css";

const CheckOutModal = ({ open, onClose, product, seller }) => {
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(
    (product?.discountPrice || product?.price) * 1 || 0
  );

  const handleQuantityChange = (e) => {
    const maxQuantity = product?.quantity || 1;
    const inputValue = parseInt(e.target.value);

    const qty = Math.max(
      1,
      Math.min(isNaN(inputValue) ? 1 : inputValue, maxQuantity)
    );

    setQuantity(qty);
    const price = product.discountPrice || product.price;
    setTotalCost(qty * price);
  };

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:3000/api/payment/makePayment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: totalCost,
            productName: product.productName,
            category: product.category,
            productId: product._id,
          }),
        }
      );

      const result = await response.json();

      if (result.url) {
        sessionStorage.setItem("purchasedProductId", product._id);
        sessionStorage.setItem("purchasedQuantity", quantity);
        sessionStorage.setItem("purchasedTotalCost", totalCost);
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="checkout-modal">
        <div className="modal-header">
          <Typography variant="h5">Confirm Order</Typography>
          <IconButton className="close-btn" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="modal-content">
          {product && (
            <>
              <div className="cart-product-info">
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="cart-product-image"
                />
                <div className="cart-product-details">
                  <Typography variant="h6">{product.productName}</Typography>
                  <Typography>
                    Price:{" "}
                    {product.discountPrice ? (
                      <>
                        <span className="discounted-price">
                          ৳{product.discountPrice}
                        </span>
                        <span className="original-price">
                          <del>৳{product.price}</del>
                        </span>
                      </>
                    ) : (
                      <span>৳{product.price}</span>
                    )}
                  </Typography>
                  <Typography>Category: {product.category}</Typography>
                  <Typography>Seller: {seller?.name || "Unknown"}</Typography>
                  <Typography>Contact: {seller?.phone || "N/A"}</Typography>
                </div>
              </div>

              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                fullWidth
                margin="normal"
                inputProps={{
                  min: 1,
                  max: product?.quantity || 1,
                }}
              />

              <Typography variant="body2" color="textSecondary" gutterBottom>
                Available in stock: {product?.quantity || 0}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Total: ৳{totalCost}
              </Typography>

              <div className="cart-action-buttons">
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleConfirmOrder}
                  disabled={product?.quantity < 1}
                >
                  {product?.quantity > 0 ? "Confirm & Pay" : "Out of Stock"}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view cart");
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:3000/api/cart/getCart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        data.success ? setCart(data.cart) : toast.error(data.message);
      } catch (error) {
        toast.error("Error loading cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/cart/removeToCart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
        toast.success("Product removed from cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error removing product");
    }
  };

  const handleBuyNow = async (product) => {
    setSelectedProduct(product);
    setCheckoutOpen(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/user/getUserById/${product.userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await response.json();
      data.user ? setSeller(data.user) : toast.error("Seller info not found");
    } catch (error) {
      console.error("Error fetching seller:", error);
      toast.error("Error loading seller information");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="cart-container">
        <Typography variant="h4" gutterBottom className="cart-header">
          <ShoppingCartIcon sx={{ fontSize: 2.5, color: '#4CAF50', mr: 1 }} />
          Your Cart
        </Typography>

        {loading ? (
          <div className="loading-spinner">
            <CircularProgress />
          </div>
        ) : (
          <div className="cart-content">
            {cart?.items?.length > 0 ? (
              cart.items.map((item) => (
                <div className="cart-item" key={item.productId._id}>
                  <img
                    src={item.productId.productImage}
                    alt={item.productId.productName}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <Typography variant="h6">
                      {item.productId.productName}
                    </Typography>
                    <Typography>
                      <CategoryIcon sx={{ color: '#4CAF50', mr: 1 }} />
                      {item.productId.category}
                    </Typography>
                    <Typography>
                      <LocalOfferIcon sx={{ color: '#4CAF50', mr: 1 }} />
                      Price:{" "}
                      {item.productId.discountPrice ? (
                        <>
                          <span className="discounted-price">
                            ৳{item.productId.discountPrice}
                          </span>
                          <span className="original-price">
                            <del>৳{item.productId.price}</del>
                          </span>
                        </>
                      ) : (
                        <span>৳{item.productId.price}</span>
                      )}
                    </Typography>
                    <Typography>
                      <InventoryIcon sx={{ color: '#4CAF50', mr: 1 }} />
                      Quantity: {item.quantity}
                    </Typography>
                  </div>
                  <div className="cart-item-actions">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleBuyNow(item.productId)}
                      disabled={item.productId.quantity < 1}
                      startIcon={<ShoppingCartIcon />}
                    >
                      {item.productId.quantity > 0 ? "Buy Now" : "Out of Stock"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleRemoveFromCart(item.productId._id)}
                      startIcon={<DeleteIcon />}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <Typography variant="h6" className="empty-cart">
                <ShoppingCartIcon sx={{ fontSize: 3, color: '#4CAF50', mb: 2 }} />
                Your cart is empty
              </Typography>
            )}
          </div>
        )}

        <CheckOutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          product={selectedProduct}
          seller={seller}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
