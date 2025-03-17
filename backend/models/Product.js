const mongoose = require("mongoose");

const userProductSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    productImage: String,
    productName: {
      type: String,
      required: [true, "Product name is required"]
    },
    category: {
      type: String,
      required: [true, "Category is required"]
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, "Quantity can't be negative"]
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be at least 1"]
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price can't be negative"],
      default: null,
      validate: {
        validator: function(value) {
          return value === null || value < this.price;
        },
        message: "Discount price must be less than regular price"
      }
    },
    description: {
      type: String,
      required: [true, "Description is required"]
    }
});

const Product = mongoose.model("Product", userProductSchema);

module.exports = Product;