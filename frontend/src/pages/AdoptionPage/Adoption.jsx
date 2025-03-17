import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/Footer/Footer";
import "./Adoption.css";

const Adoption = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalAdoptions, setTotalAdoptions] = useState(0);

  const categories = ["Cat", "Dog", "Bird", "Fish", "Rabbit"];

  const fetchAdoptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/adoption/getAdoption?page=${page}&category=${category}`
      );
      const data = await response.json();
      setAdoptions(data.adoptions);
      setTotalAdoptions(data.totalAdoptions);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching adoption data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, [page, category]);

  return (
    <div>
      <NavBar />

      <div className="adoption-filter-container">
        <FormControl size="small">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((categoryName) => (
              <MenuItem key={categoryName} value={categoryName}>
                {categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <div className="adoption-cards">
          {adoptions.length > 0 ? (
            adoptions.map((adoption) => (
              <div className="adoption-card" key={adoption._id}>
                <img
                  src={adoption.petImage || "/images/default-pet.jpg"}
                  alt={adoption.petName}
                  className="adoption-photo"
                />
                <h6>{adoption.petName}</h6>
                <p>
                  <strong>Category:</strong> {adoption.category}
                </p>
                <p>
                  <strong>Description:</strong> {adoption.description}
                </p>
                <p>
                  <strong>Quantity:</strong> {adoption.quantity}
                </p>
                <p>
                  <strong>Owner:</strong> {adoption.userId?.name || "Anonymous"}
                </p>
                <p>
                  <strong>Address:</strong> {adoption.userId?.address || "Not Provided"}
                </p>
                <p>
                  <strong>Contact:</strong> {adoption.userId?.phone || "Not Provided"}
                </p>
              </div>
            ))
          ) : (
            <Typography variant="h6" className="no-adoptions-message">
              No pets available for adoption in this category.
            </Typography>
          )}
        </div>
      )}

      <div className="adoption-pagination">
        <Button
          variant="outlined"
          disabled={page === 1}
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
          disabled={page * 12 >= totalAdoptions}
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
      <Footer/>
    </div>
  );
};

export default Adoption;
