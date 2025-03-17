import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress, Button, TextField, Rating, Chip } from "@mui/material";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import PetsIcon from '@mui/icons-material/Pets';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import "./Details.css";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productResponse = await fetch(
          `http://localhost:3000/api/details/getProductById/${id}`
        );
        const productData = await productResponse.json();

        if (productData.success) {
          setProduct(productData.product);
          setSeller(productData.seller);
          setReviews(productData.reviews);
        } else {
          toast.error("Failed to load product details.");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details.");
      }
      setIsLoading(false);
    };

    fetchProductDetails();
  }, [id]);

  const handleAddReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please enter a review.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/details/addReview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product._id,
            rating,
            reviewText,
          }),
        }
      );
      const result = await response.json();

      if (result.success) {
        setReviews([...reviews, result.review]);
        setReviewText("");
        setRating(0);
        toast.success("Review added successfully!");
      } else {
        toast.error("Please login first.");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to add review.");
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
      } else {
        toast.error("Please login first.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Unable to add product to cart. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="details-page">
      
      <div className="details-content">
        <h1 className="details-title">
          <PetsIcon sx={{ fontSize: 2.5, color: '#4CAF50' }} />
          Product Details
        </h1>

        <div className="product-details-container">
          <div className="product-photo">
            <img src={product.productImage} alt={product.productName} />
          </div>

          <div className="product-details">
            <h2>{product.productName}</h2>
            <Chip 
              icon={<CategoryIcon />} 
              label={product.category} 
              color="success" 
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            />
            <p>
              <DescriptionIcon sx={{ color: '#4CAF50' }} />
              {product.description}
            </p>
            <div className="price-container">
              {product.discountPrice ? (
                <>
                  <span className="discounted-price">
                    <LocalOfferIcon sx={{ color: '#4CAF50' }} />
                    {product.discountPrice} Tk
                  </span>
                  <span className="original-price">
                    ({product.price} Tk)
                  </span>
                </>
              ) : (
                <span className="discounted-price">
                  <LocalOfferIcon sx={{ color: '#4CAF50' }} />
                  {product.price} Tk
                </span>
              )}
            </div>
            <p>
              <InventoryIcon sx={{ color: '#4CAF50' }} />
              {product.quantity > 0 ? (
                <span style={{ color: '#4CAF50' }}>In Stock ({product.quantity} available)</span>
              ) : (
                <span style={{ color: '#f44336' }}>Out of Stock</span>
              )}
            </p>
            {product.quantity > 0 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddToCart(product._id)}
                startIcon={<ShoppingCartIcon />}
                sx={{
                  mt: 2,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  padding: '12px 32px',
                  backgroundColor: '#4CAF50',
                  '&:hover': {
                    backgroundColor: '#45a049',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 20px rgba(76, 175, 80, 0.2)'
                  }
                }}
              >
                Add To Cart
              </Button>
            ) : (
              <Button
                variant="contained"
                disabled
                startIcon={<ShoppingCartIcon />}
                sx={{
                  mt: 2,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  padding: '12px 32px'
                }}
              >
                Out of Stock
              </Button>
            )}
          </div>
        </div>

        {seller && (
          <div className="seller-container">
            <div className="seller-photo">
              <img src={seller.profileImage} alt={seller.name} />
            </div>

            <div className="seller-info">
              <h2>Seller Information</h2>
              <p>
                <PersonIcon sx={{ color: '#4CAF50' }} />
                {seller.name}
              </p>
              <p>
                <LocationOnIcon sx={{ color: '#4CAF50' }} />
                {seller.address}
              </p>
              <p>
                <PhoneIcon sx={{ color: '#4CAF50' }} />
                {seller.phone}
              </p>
            </div>
          </div>
        )}

        <div className="reviews-section">
          <h3>
            <StarIcon sx={{ color: '#4CAF50' }} />
            Reviews ({reviews.length})
          </h3>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="review" key={review._id}>
                <div className="reviewer-photo">
                  <img src={review.reviewerPhoto} alt={review.reviewerName} />
                </div>
                <div className="review-content">
                  <h4>{review.reviewerName}</h4>
                  <p>
                    <AccessTimeIcon sx={{ fontSize: 16, color: '#666' }} />
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                  <Rating value={review.rating} readOnly sx={{ color: '#4CAF50' }} />
                  <p className="review-text">{review.reviewText}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No reviews yet. Be the first to review this product!</p>
          )}
        </div>

        <div className="add-review-section">
          <h3>
            <StarIcon sx={{ color: '#4CAF50' }} />
            Add Your Review
          </h3>
          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            sx={{ color: '#4CAF50', mb: 2 }}
          />
          <TextField
            label="Your Review"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddReview();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                fontFamily: 'Poppins',
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Poppins',
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddReview}
            startIcon={<StarIcon />}
            sx={{
              mt: 2,
              borderRadius: '12px',
              textTransform: 'none',
              fontFamily: 'Poppins',
              fontWeight: 500,
              padding: '12px 32px',
              backgroundColor: '#4CAF50',
              '&:hover': {
                backgroundColor: '#45a049',
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 20px rgba(76, 175, 80, 0.2)'
              }
            }}
          >
            Submit Review
          </Button>
        </div>
      </div>
   
    </div>

      <Footer />
    </div>

      );
};

export default Details;
