const User = require("../models/User");
const Product = require("../models/Product");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { uploadImageToCloudinary } = require('../utils/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.addProduct = [
  upload.single('productImage'),
  async (req, res) => {
    const { productName, category, quantity, price, description } = req.body;

    try {

      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      if (!productName || !category || !quantity || !price || !description) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
      }

      let productImageUrl = '';

      if (req.file) {
        productImageUrl = await uploadImageToCloudinary(req.file.buffer, `products/${req.user.id}`);
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
        message: 'Product added successfully.',
        product: newProduct,
      });
    } catch (error) {
      console.error('Error adding product:', error.message, error.stack);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while adding the product.',
      });
    }
  },
];
