const Product = require("../models/Product");
const User = require("../models/User");
const Review = require("../models/Review");

exports.getProductById = async (req, res) => {
  const { id } = req.params; 

  try {
    const product = await Product.findById(id).populate('userId');
    const reviews = await Review.find({ productId: id });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    return res.status(200).json({
      success: true,
      product,
      seller: product.userId,
      reviews, 
    });
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product details.",
    });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, reviewText } = req.body;
    const userId = req.user.id; 

    const user = await User.findById(userId).select("name profileImage");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const review = new Review({
      productId,
      reviewerName: user.name,      
      reviewerPhoto: user.profileImage, 
      rating,
      reviewText,
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully.",
      review,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Failed to add review." });
  }
};
