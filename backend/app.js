const express = require('express');
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  };
  
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "defaultSecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', userRoutes);
app.use('/api/authentication', authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
