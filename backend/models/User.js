const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

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
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const User = mongoose.model('User', userSchema);

module.exports = User;
