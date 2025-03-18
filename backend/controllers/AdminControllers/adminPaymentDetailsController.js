const Payment = require("../../models/Payment");
exports.getPayment = async (req, res) => {
    try {
      const payments = await Payment.find()
        .sort({ purchasedDate: -1 })
  
      res.status(200).json({
        success: true,
        payments
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching payment details"
      });
    }
};