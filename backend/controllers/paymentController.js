const SSLCommerzPayment = require("sslcommerz-lts");
const User = require("../models/User");
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

    const { amount, productName, category, productId } = req.body;

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
