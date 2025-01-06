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
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/product/getProduct?page=${page}&category=${category}&search=${searchTerm}`
      );
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching products.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, category, searchTerm]);

  return (
    <div>
      <NavBar />
      <div className="filter-container">
        <FormControl size="small" className="category-dropdown">
          <InputLabel
            shrink={false}
          >
          </InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty 
          >
            <MenuItem value="">
              All
            </MenuItem>{" "}
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
      ) : products.length === 0 ? (
        <div className="no-results-container">
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
              <div className="product-actions">
                <Button variant="contained" color="primary">
                  Add to Cart
                </Button>
                <Button variant="outlined">Details</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button variant="outlined" onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Home;
