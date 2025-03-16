const mongoose = require("mongoose");

const userProductSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    productImage: String,
    productName: String,
    category: String,
    quantity: {
        type: Number,
        default: 0,
        min: [0, "Quantity can't be negative"]
    },
    price: Number,
    description: String

});

const Product = mongoose.model("Product", userProductSchema);

module.exports = Product;