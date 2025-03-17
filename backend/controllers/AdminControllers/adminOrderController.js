const Order = require("../../models/Order");
const { sendStatusEmail } = require('../../utils/emailService');


exports.getOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("productId", "productName price category")
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
};


exports.updateOrderStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
  
      const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order status'
        });
      }
  
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true, runValidators: true }
      )
        .populate('userId', 'email name')
        .populate('productId', 'productName');
  
      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
  
      await sendStatusEmail(updatedOrder);
  
      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order: updatedOrder
      });
  
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating order status',
        error: error.message
      });
    }
};