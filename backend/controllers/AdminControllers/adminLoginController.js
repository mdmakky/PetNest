const nodemailer = require("nodemailer");
const crypto = require("crypto");
const generateToken = require("../../config/token");
const Admin = require("../../models/AdminModels/Admin");
const { gmail, appPassword } = require("../../config/env");


exports.postLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const admin = await Admin.findOne({ email });
  
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Admin not found. Please contact with authority to register",
        });
      }
  
      const isMatch = await admin.comparePassword(password);
  
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
  
      const token = generateToken(admin);
  
      res.status(200).json({
        success: true,
        message: "Login successful!",
        token,
        redirectUrl: "/adminHome",
        adminId: admin._id
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    }
};