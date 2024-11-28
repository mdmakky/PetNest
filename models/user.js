const mongoose = require('mongoose')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    email: String,
    dob: String,
    gender: String,
    password: String,
    profileImage: String,
    nid: String,
    profileComplete: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: String,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

const User = mongoose.model('User', userSchema)

passport.use(User.createStrategy())

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id).then(function (user) {
        done(null, user);
    }).catch(function (err) {
        done(err);
    });
});

module.exports = User;