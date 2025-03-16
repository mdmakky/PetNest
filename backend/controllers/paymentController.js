const SSLCommerzPayment = require("sslcommerz-lts");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const { STORE_ID, STORE_PASSWORD, SSLCOMMERZ_SANDBOX } = require("../config/env");

const store_id = STORE_ID;
const store_passwd = STORE_PASSWORD;
const is_live = SSLCOMMERZ_SANDBOX === "false";

exports.makePayment = async (req, res) => {
  
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { amount, productName, category } = req.body;

    if (!amount || !productName || !category) {
      return res.status(400).json({ error: "Amount, product name, and category are required" });
    }

    const transactionId = "txn_" + new Date().getTime();

    const data = {
      total_amount: amount,
      currency: "BDT",
      tran_id: transactionId,
      success_url: 'http://localhost:3000/payment/success',
      fail_url: "http://localhost:3000/payment-failed",
      cancel_url: "http://localhost:3000/payment-cancel",
      shipping_method: "Courier",
      product_name: productName,
      product_category: category,
      product_profile: "general",
      cus_name: user.name,
      ship_name: user.name,
      ship_add1: user.address,
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
      cus_email: user.email,
      cus_add1: user.address,
      cus_country: "Bangladesh",
      cus_phone: user.phone,
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    sslcz.init(data)
      .then(apiResponse => {
        let gatewayUrl = apiResponse.GatewayPageURL;
        if (gatewayUrl) {
          res.json({ url: gatewayUrl });
        } else {
          res.status(400).json({ error: "Failed to generate payment gateway URL" });
        }
      })
      .catch(error => {
        console.error("SSLCommerz Error:", error);
        res.status(500).json({ error: "Payment initiation failed" });
      });

  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const { productId, quantity, totalCost } = req.body;
    const userId = req.user.id;

    console.log(totalCost)

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    let productFound = false;
    let updatedCartItems = cart.items.map((item) => {
      if (item.productId.toString() === productId) {
        productFound = true;

        if (item.quantity > quantity) {
          item.quantity -= quantity; 
        } else {
          return null; 
        }
      }
      return item;
    }).filter(Boolean);

    if (!productFound) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    cart.items = updatedCartItems; 
    await cart.save();

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product.quantity -= quantity;
    await product.save();

    const order = new Order({
      userId: userId,
      productId: productId,
      sellerId: product.userId,
      quantity: quantity,
      totalCost: totalCost,
      purchaseDate: new Date(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    });

    await order.save();

    res.json({
      success: true,
      message: "Order processed successfully",
      cart,
      product
    });

  } catch (error) {
    console.error("Order completion error:", error);
    res.status(500).json({
      success: false,
      message: "Error completing order"
    });
  }
};
