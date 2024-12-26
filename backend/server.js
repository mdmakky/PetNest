const colors = require("colors");
const connectDB = require('./config/db');
const { port } = require('./config/env');
const passport = require('passport');
const User = require('./models/User');

const app = require('./app');

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

connectDB();

app.listen(port, () => {
    console.log(`App is running on port ${port}`.yellow.bold);
});

