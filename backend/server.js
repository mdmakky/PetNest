const connectDB = require('./config/db');
const { port } = require('./config/env');

const app = require('./app');

connectDB();

app.listen(port, () => {
    console.log(`App is running on port ${port}`.yellow.bold);
});

