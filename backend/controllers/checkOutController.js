const Order = require("../models/Order");
const Product = require("../models/Product");

exports.confirm = async (req, res) => {
    const { productId, quantity, totalCost, purchaseDate, deliveryDate, sellerId } = req.body;
    const userId = req.user.id; 
  
    try {
      const product = await Product.findById(productId);
      if (!product || product.quantity < quantity) {
        return res.status(400).json({ message: "Insufficient product stock" });
      }
  
      const order = new Order({
        userId,
        productId,
        quantity,
        totalCost,
        purchaseDate,
        deliveryDate,
        sellerId,
        status: "Confirmed",
      });
  
      await order.save();
  
      product.quantity -= quantity;
      await product.save();
  
      res.status(201).json({ success: true, order: order.toObject() });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ success: false, message: error.message || "Error creating order" });
    }
};
  