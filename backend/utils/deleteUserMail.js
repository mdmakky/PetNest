const nodemailer = require('nodemailer');
const { gmail, appPassword } = require("../config/env");

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: gmail,
    pass: appPassword
  }
});


const sendDeleteEmail = async (email) => {
  const mailOptions = {
    from: gmail,
    to: email,
    subject: 'Account Deletion Notification',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #dc3545;">Account Deletion Notice</h2>
        <p>Your account has been deleted by the administrator due to violation of our terms of service.</p>
        <p>If you believe this was a mistake, please contact our support team.</p>
        <hr>
        <p style="color: #666;">Best regards,<br>PetnSet Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending delete email:', error);
  }
};

module.exports = { sendDeleteEmail };