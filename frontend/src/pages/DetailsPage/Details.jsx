import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress, Button, TextField, Rating } from "@mui/material";
import NavBar from "../../components/NavBar/NavBar";
import "./Details.css";

const Details = () => {
  const { id } = useParams();

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
      <div className="details-container">
        <div className="product-details-container">
          <div className="product-photo">
            <img src={product.productImage} alt={product.productName} />
          </div>

          <div className="product-details">
            <h2>{product.productName}</h2>
            <p>Description: {product.description}</p>
            <p>Price: Tk {product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <p>Category: {product.category}</p>
            {product.quantity > 0 ? (
              <Button variant="contained" color="primary">
                Buy Now
              </Button>
            ) : (
              <Button variant="contained" disabled>
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
              <p>Name: {seller.name}</p>
              <p>Address: {seller.address}</p>
              <p>Phone: {seller.phone}</p>
            </div>
          </div>
        )}

        <div className="reviews-section">
          <h3>Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="review" key={review._id}>
                <img
                  src={review.reviewerPhoto}
                  alt={review.reviewerName}
                  className="reviewer-photo"
                />
                <div>
                  <h4>{review.reviewerName}</h4>
                  <p>{new Date(review.createdAt).toLocaleString()}</p>
                  <Rating value={review.rating} readOnly />
                  <p>{review.reviewText}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

        <div className="add-review-section">
          <h3>Add Your Review</h3>
          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
          />
          <TextField
            label="Your Review"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleAddReview}>
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Details;
