require('events').EventEmitter.defaultMaxListeners = 20;
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const detailsRoutes = require('./routes/detailsRoutes');
const cartRoutes = require('./routes/cartRoutes');
const blogRoutes = require('./routes/blogRoutes');
const checkOutRoutes = require('./routes/checkOutRoutes');
const orderRoutes = require('./routes/orderRoutes');

require('dotenv').config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
  
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/user', userRoutes);
app.use('/api/authentication', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/details', detailsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/checkOut', checkOutRoutes);
app.use('/api/order', orderRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
