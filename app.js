require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const path = require('path');

const authController = require("./controllers/authController")
const userController = require("./controllers/userController")

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.use(session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_CONNECTION)


app.get('/login', authController.getLogin)
app.post('/login', authController.postLogin)
app.get('/register', authController.getRegister)
app.post('/register', authController.postRegister)
app.get('/verifyEmail', authController.getVerifyEmail)
app.post('/verifyEmail', authController.postVerifyEmail)
app.get('/forgotPassword', authController.getforgotPassword)
app.post('/forgotPassword', authController.postforgotPassword)
app.get('/authCode', authController.getauthCode)
app.post('/authCode', authController.postauthCode)
app.get('/resetPassword', authController.getresetPassword)
app.post('/resetPassword', authController.postresetPassword)
app.get('/profile', userController.getProfile)
app.get('/editProfile', userController.getEditProfile)
app.post('/editProfile', userController.postEditProfile)
app.post('/removeProfilePic', userController.removeProfilePic)


const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
