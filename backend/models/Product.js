const mongoose = require("mongoose");
const User = require("../models/User");

const userProductSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    productImage: String,
    productName: String,
    category: String,
    quantity: String,
    price: Number,
    description: String
});

const Product = mongoose.model("Product", userProductSchema);

module.exports = Product;