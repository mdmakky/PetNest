import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Container,
  Box,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { FaComment } from "react-icons/fa";
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import "./Home.css";
import Chatbot from "../ChatBotPage/ChatBot";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [noResults, setNoResults] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setNoResults(false);

      const token = localStorage.getItem("token");

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(
        `http://localhost:3000/api/product/getProduct?page=${page}&category=${category}&search=${searchTerm}`,
        { headers }
      );

      if (response.status === 401) {
        toast.error("Please log in first.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
        if (data.products.length === 0) {
          setNoResults(true);
        }
      } else {
        toast.error("Error fetching products.");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching products.");
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/cart/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Product added to cart successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error("Please login first.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Unable to add product to cart. Please try again.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, category, searchTerm]);

  const handleDetailsClick = (productId) => {
    navigate(`/details/${productId}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <NavBar />
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6, mt: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: '#2c3e50',
              mb: 2,
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Find Your Perfect Pet Supplies
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#666',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400
            }}
          >
            Discover high-quality products for your beloved pets
          </Typography>
        </Box>

        <div className="filter-container">
          <FormControl size="small" className="category-dropdown">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              displayEmpty
              startAdornment={<CategoryIcon sx={{ mr: 1, color: '#4CAF50' }} />}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4CAF50',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4CAF50',
                },
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="Pet">Pet</MenuItem>
              <MenuItem value="Pet Food">Pet Food</MenuItem>
              <MenuItem value="Pet Accessories">Pet Accessories</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Search Products"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-box"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: '#4CAF50' }} />,
            }}
          />

          <Button
            variant="contained"
            className="search-button"
            onClick={fetchProducts}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </div>

        {loading ? (
          <div className="loading-container">
            <CircularProgress size={60} />
          </div>
        ) : noResults ? (
          <Paper 
            elevation={0} 
            className="no-results-pet-container"
          >
            <Typography variant="h6" color="textSecondary">
              No results found.
            </Typography>
          </Paper>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <Paper 
                elevation={0} 
                className="product-card" 
                key={product._id}
              >
                {product.discountPrice && (
                  <div className="discount-badge">
                    {Math.round(
                      ((product.price - product.discountPrice) / product.price) *
                        100
                    )}
                    % OFF
                  </div>
                )}

                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="product-image"
                />
                <div className="product-card-content">
                  <h3>{product.productName}</h3>
                  <div className="price-container">
                    {product.discountPrice ? (
                      <>
                        <span className="discounted-price">
                          {product.discountPrice} Tk
                        </span>
                        <span className="original-price">
                          ({product.price} Tk)
                        </span>
                      </>
                    ) : (
                      <span className="discounted-price">
                        {product.price} Tk
                      </span>
                    )}
                  </div>

                  <p
                    className={`product-status ${
                      product.quantity > 0 ? "in-stock" : "out-of-stock"
                    }`}
                  >
                    {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                  </p>

                  <div className="product-actions">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={product.quantity === 0}
                      onClick={
                        product.quantity > 0
                          ? () => handleAddToCart(product._id)
                          : null
                      }
                      sx={{
                        backgroundColor: '#4CAF50',
                        '&:hover': {
                          backgroundColor: '#45a049',
                        },
                      }}
                    >
                      {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => handleDetailsClick(product._id)}
                      sx={{
                        borderColor: '#4CAF50',
                        color: '#4CAF50',
                        '&:hover': {
                          borderColor: '#45a049',
                          backgroundColor: 'rgba(76, 175, 80, 0.04)',
                        },
                      }}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </Paper>
            ))}
          </div>
        )}

        <div className="pagination">
          <Button
            variant="outlined"
            disabled={page === 1 || noResults}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            disabled={page === totalPages || noResults}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </Container>

      <div className="message-icon-container">
        <div className="message-text">Ask Meowster!</div>
        <div
          className={`message-icon ${showChatbot ? "chat-open" : ""}`}
          onClick={() => setShowChatbot(!showChatbot)}
        >
          <FaComment size={30} />
        </div>
      </div>

      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}

      <Footer />
    </Box>
  );
};

export default Home;
