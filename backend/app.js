require("events").EventEmitter.defaultMaxListeners = 20;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const detailsRoutes = require("./routes/detailsRoutes");
const cartRoutes = require("./routes/cartRoutes");
const blogRoutes = require("./routes/blogRoutes");
const checkOutRoutes = require("./routes/checkOutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const qaRoutes = require("./routes/qaRoutes");
const chatBotRoutes = require("./routes/chatBotRoutes");
const adminLoginRoutes = require("./routes/AdminRoutes/adminLoginRoutes");
const adminBlogRoutes = require("./routes/AdminRoutes/adminBlogRoutes");
const adminDoctorRoutes = require("./routes/AdminRoutes/adminDoctorRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/authentication", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/details", detailsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/checkOut", checkOutRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/adoption", adoptionRoutes);
app.use("/api/qa", qaRoutes);
app.use("/api/chatBot", chatBotRoutes);
app.use("/api/admin/adminAuthentication", adminLoginRoutes);
app.use("/api/admin/adminBlog", adminBlogRoutes);
app.use("/api/admin/adminDoctor", adminDoctorRoutes);
app.use("/api/payment", paymentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

app.post("/payment/success", (req, res) => {
  const transactionId = req.body.tran_id;

  res.redirect(`http://localhost:5173/paymentSuccess?tran_id=${transactionId}`);
});

module.exports = app;
