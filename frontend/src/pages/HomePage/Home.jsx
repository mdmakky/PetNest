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
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../../components/NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import { FaComment } from "react-icons/fa";
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
    <div>
      <NavBar />
      <div className="filter-container">
        <FormControl size="small" className="category-dropdown">
          <InputLabel shrink={false}></InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pet">Pet</MenuItem>
            <MenuItem value="Pet Food">Pet Food</MenuItem>
            <MenuItem value="Pet Accessories">Pet Accessories</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />

        <Button
          variant="contained"
          className="search-button"
          onClick={fetchProducts}
        >
          Search
        </Button>
      </div>

      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : noResults ? (
        <div className="no-results-pet-container">
          <Typography variant="h6" color="textSecondary">
            No results found.
          </Typography>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <img
                src={product.productImage}
                alt={product.productName}
                className="product-image"
              />
              <h3>Name: {product.productName}</h3>
              <p>Price: {product.price} Tk</p>

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
                >
                  {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => handleDetailsClick(product._id)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent', 
                      color: 'primary.main',
                    },
                  }}
                >
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <Button
          variant="outlined"
          disabled={page === 1 || noResults}
          onClick={() => setPage(page - 1)}
          sx={{
            '&:hover': {
              backgroundColor: 'transparent', 
              color: 'primary.main',
            },
          }}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          disabled={page === totalPages || noResults}
          onClick={() => setPage(page + 1)}
          sx={{
            '&:hover': {
              backgroundColor: 'transparent', 
              color: 'primary.main',
            },
          }}
        >
          Next
        </Button>
      </div>

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

    </div>
  );
};

export default Home;
