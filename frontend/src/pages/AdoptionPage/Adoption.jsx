import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  Typography,
  CircularProgress,
  Container,
  Box,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/Footer/Footer";
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
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
            Find Your Perfect Companion
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#666',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400
            }}
          >
            Discover loving pets waiting for their forever homes
          </Typography>
        </Box>

        <div className="adoption-filter-container">
          <FormControl size="small">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              displayEmpty
              startAdornment={<PetsIcon sx={{ mr: 1, color: '#4CAF50' }} />}
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
            <CircularProgress size={60} />
          </div>
        ) : (
          <>
            <div className="adoption-cards">
              {adoptions.length > 0 ? (
                adoptions.map((adoption) => (
                  <Paper 
                    elevation={0} 
                    className="adoption-card" 
                    key={adoption._id}
                  >
                    <img
                      src={adoption.petImage || "/images/default-pet.jpg"}
                      alt={adoption.petName}
                      className="adoption-photo"
                    />
                    <div className="adoption-card-content">
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
                      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
                        <p>
                          <PersonIcon sx={{ mr: 1, color: '#4CAF50', verticalAlign: 'middle' }} />
                          <strong>Owner:</strong> {adoption.userId?.name || "Anonymous"}
                        </p>
                        <p>
                          <LocationOnIcon sx={{ mr: 1, color: '#4CAF50', verticalAlign: 'middle' }} />
                          <strong>Address:</strong> {adoption.userId?.address || "Not Provided"}
                        </p>
                        <p>
                          <PhoneIcon sx={{ mr: 1, color: '#4CAF50', verticalAlign: 'middle' }} />
                          <strong>Contact:</strong> {adoption.userId?.phone || "Not Provided"}
                        </p>
                      </Box>
                    </div>
                  </Paper>
                ))
              ) : (
                <Paper 
                  elevation={0} 
                  className="no-adoptions-message"
                >
                  <PetsIcon sx={{ fontSize: 48, color: '#4CAF50', mb: 2 }} />
                  <Typography variant="h6">
                    No pets available for adoption in this category.
                  </Typography>
                </Paper>
              )}
            </div>

            <div className="adoption-pagination">
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                startIcon={<PetsIcon />}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#4CAF50',
                    color: 'white',
                  },
                }}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                disabled={page * 12 >= totalAdoptions}
                onClick={() => setPage(page + 1)}
                endIcon={<PetsIcon />}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#4CAF50',
                    color: 'white',
                  },
                }}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default Adoption;
