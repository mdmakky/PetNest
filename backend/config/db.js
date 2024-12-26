const mongoose = require('mongoose');
const colors = require('colors');
const { dbConnection } = require('./env');

const connectDB = async () => {
    mongoose.connect(dbConnection, {
      })
      .then(() => console.log("Database connection established".green.bold))  
      .catch((err) => {
        console.error("Database connection failed".red.bold); 
        console.error(err);
      });  
};

module.exports = connectDB;
