const nodemailer = require('nodemailer');
const { gmail, appPassword } = require("../config/env");

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: gmail,
    pass: appPassword
  }
});

exports.sendStatusEmail = async (order) => {
  try {
    const statusMessages = {
      'Shipped': `Your order #${order.orderId} has been shipped!`,
      'Delivered': `Your order #${order.orderId} has been delivered!`,
      'Cancelled': `Your order #${order.orderId} has been cancelled.`
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: order.userId.email,
      subject: `Order Status Update: ${order.status}`,
      html: `
        <h1>Order Update</h1>
        <p>Hello ${order.userId.name},</p>
        <p>${statusMessages[order.status] || 'Your order status has been updated'}</p>
        <h3>Order Details:</h3>
        <ul>
          <li>Order ID: ${order.orderId}</li>
          <li>Product: ${order.productId.productName}</li>
          <li>Category: ${order.productId.category}</li>
          <li>New Status: ${order.status}</li>
        </ul>
        <p>Thank you for choosing our service!</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Status email sent to ${order.userId.email}`);
  } catch (error) {
    console.error('Error sending status email:', error);
    throw error;
  }
};