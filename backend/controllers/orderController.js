const Order = require("../models/Order");

exports.getOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ userId }).populate({
      path: "productId",
      select: "productName category productImage",
    });

    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }

    const orderDetails = orders.map((order) => ({
      _id: order._id,
      productName: order.productId.productName,
      category: order.productId.category,
      productImage: order.productId.productImage,
      quantity: order.quantity,
      totalCost: order.totalCost,
      purchaseDate: order.purchaseDate,
      deliveryDate: order.deliveryDate,
      status: order.status,
    }));

    res.json({ orders: orderDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};


exports.cancelOrder = async (req, res) => {
    const { orderId } = req.params;
  
    try {

      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }
  
      if (order.status === "Cancelled") {
        return res.status(400).json({ message: "Order is already canceled." });
      }
  
      order.status = "Cancelled";
  
      await order.save();
  
      return res.status(200).json({ message: "Order canceled successfully.", order });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error. Could not cancel order." });
    }
};