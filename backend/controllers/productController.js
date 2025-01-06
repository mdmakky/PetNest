const Product = require("../models/Product");
const multer = require("multer");
const { uploadImageToCloudinary } = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.getProduct = async (req, res) => {
  const { category, search, page = 1, limit = 12 } = req.query;

  try {
    const query = {};
    let userId = null;

    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }

    if (userId) {
      query.userId = { $ne: userId };
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.productName = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query).skip(skip).limit(parseInt(limit));
    const totalProducts = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
    });
  }
};


exports.getUserProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const products = await Product.find({ userId: req.user.id });

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found." });
    }

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully.",
      products,
    });
  } catch (error) {
    console.error("Error retrieving products:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the products.",
    });
  }
};

exports.addProduct = [
  upload.single("productImage"),
  async (req, res) => {
    const { productName, category, quantity, price, description } = req.body;

    try {
      if (!req.user || !req.user.id) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      if (!productName || !category || !quantity || !price || !description) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required." });
      }

      let productImageUrl = "";

      if (req.file) {
        productImageUrl = await uploadImageToCloudinary(
          req.file.buffer,
          "products",
          `${req.user.id}/${productName}`, 
          true 
        );
      }

      const newProduct = new Product({
        userId: req.user.id,
        productImage: productImageUrl,
        productName,
        category,
        quantity,
        price,
        description,
      });

      await newProduct.save();

      return res.status(201).json({
        success: true,
        message: "Product added successfully.",
        product: newProduct,
      });
    } catch (error) {
      console.error("Error adding product:", error.message, error.stack);
      return res.status(500).json({
        success: false,
        message: "An error occurred while adding the product.",
      });
    }
  },
];

exports.updateProduct = async (req, res) => {
  const { productId, productName, category, quantity, price, description } = req.body;

  try {

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required." });
    }

    const product = await Product.findOne({ _id: productId, userId: req.user.id });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    if (req.file) {
      const newImageUrl = await uploadImageToCloudinary(
        req.file.buffer,
        "products",
        `${req.user.id}/${productName}`,
        true
      );
      product.productImage = newImageUrl;
    }

    product.productName = productName || product.productName;
    product.category = category || product.category;
    product.quantity = quantity || product.quantity;
    product.price = price || product.price;
    product.description = description || product.description;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the product.",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const { productId } = req.body;

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required." });
    }

    const product = await Product.findOneAndDelete({ _id: productId, userId: req.user.id });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or already deleted." });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting product:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the product.",
    });
  }
};

exports.getUserProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const products = await Product.find({ userId: req.user.id });

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found." });
    }

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully.",
      products,
    });
  } catch (error) {
    console.error("Error retrieving products:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the products.",
    });
  }
};

