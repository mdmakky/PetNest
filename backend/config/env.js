require('dotenv').config();  

const requiredEnvVars = [
    'DB_CONNECTION', 
    'GMAIL', 
    'APP_PASSWORD', 
    'CLOUD_NAME',
    'API_KEY',
    'API_SECRET',
    'PORT',
    'JWT_SECRET'
];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`ERROR: Missing required environment variable ${varName}`);
        process.exit(1);
    }
});

module.exports = {
    dbConnection: process.env.DB_CONNECTION,
    gmail: process.env.GMAIL,
    appPassword: process.env.APP_PASSWORD,
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    port: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET
};
