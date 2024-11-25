const passport = require("passport")
const nodemailer = require("nodemailer")
const User = require("../models/user")
const crypto = require('crypto')

exports.getLogin = (req, res) => {
    res.render('login')
};

exports.postLogin = async (req, res, next) => {
    passport.authenticate("local", async function(err, user, info) {
        if (err) { 
            console.log(err); 
            return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
        }
        if (!user) { 
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        if (!user.isVerified) {

            const verificationToken = crypto.randomInt(10000, 100000); 
            user.emailVerificationToken = verificationToken;
            user.emailVerificationExpires = Date.now() + 5 * 60 * 1000;

            await user.save();

            const transporter = nodemailer.createTransport({
                host: "smtp.example.com",
                port: 587,
                secure: false,
                service: "gmail",
                auth: {
                    user: process.env.GMAIL,
                    pass: process.env.APP_PASSWORD,
                },
            });

            const mailOptions = {
                from: {
                    name: "PetNest",
                    address: process.env.GMAIL
                },
                to: user.email,
                subject: 'Email Verification',
                text: `Please verify your email address by using the following token:\n\n
                ${verificationToken}\n\n
                This token is valid for 5 minutes.`,
            };

            await transporter.sendMail(mailOptions);

            return res.status(403).json({ success: false, message: "Please verify your email before login", redirectUrl: "/verifyEmail" });
        }
        req.logIn(user, function(err) {
            if (err) { 
                console.log(err); 
                return res.status(500).json({ success: false, message: "Login failed. Please try again." });
            }

            res.status(200).json({ success: true, message: "Login successful!", redirectUrl: "/welcome" });
        });
    })(req, res, next);
};


exports.getRegister = (req, res) => {
    res.render('register')
};

exports.postRegister = (req, res) => {
    const name = req.body.name;
    const address = req.body.address;
    const phone = req.body.phone;
    const email = req.body.email;
    const dob = req.body.dob;
    const gender = req.body.gender;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if(password !== confirmPassword){
        return res.status(400).json({ success: false, message: "Password doesn't match" });
    }

     if (password.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    const user = new User({ 
        name: name, 
        address: address, 
        phone: phone, 
        email: email, 
        dob: dob,
        gender: gender,
        isVerified: false
    });

    User.register(user, password, async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(409).json({ success: false, message: "This email already have an account. Please try another." });
        }

        try {
            const verificationToken = crypto.randomInt(10000, 100000); 
            user.emailVerificationToken = verificationToken;
            user.emailVerificationExpires = Date.now() + 5 * 60 * 1000;

            await user.save();

            const transporter = nodemailer.createTransport({
                host: "smtp.example.com",
                port: 587,
                secure: false,
                service: "gmail",
                auth: {
                    user: process.env.GMAIL,
                    pass: process.env.APP_PASSWORD,
                },
            });

            const mailOptions = {
                from: {
                    name: "PetNest",
                    address: process.env.GMAIL
                },
                to: user.email,
                subject: 'Email Verification',
                text: `Please verify your email address by using the following token:\n\n
                ${verificationToken}\n\n
                This token is valid for 5 minutes.`,
            };

            await transporter.sendMail(mailOptions);

            return res.status(403).json({ success: false, message: "Please verify your email before login", redirectUrl: "/verifyEmail" });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
        }
    });
};

exports.getVerifyEmail = (req, res) => {
    res.render("verifyEmail");
};

exports.postVerifyEmail = async (req, res) => {
    const token = req.body.token;

    try {
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: "Verification token is invalid or has been expired" });
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Congratulations! Your email has been verified! You can now login!", redirectUrl: "/login" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
    }
};

exports.getforgotPassword = (req, res) => {
    res.render("forgotPassword");
};

exports.postforgotPassword = async (req, res) => {
    const email = req.body.email;

    try {
        const user = await User.findOne({email: email});

        if(!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        const token = crypto.randomInt(10000, 100000);

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;

        await user.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.example.com",
            port: 587,
            secure: false,
            service: "gmail",
            auth: {
                user: process.env.GMAIL,
                pass: process.env.APP_PASSWORD,
            },
        })

        const mailOptions = {
            from: {
                name: "PetNest",
                address: process.env.GMAIL
            },
            to: user.email,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
            Your password reset token is:\n\n
            ${token}\n\n
            This token is valid for 5 minutes. If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Check your email", redirectUrl: "/authCode" });

    } catch (err) {
        console.log(err);
        res.redirect("/forgotPassword");
    }
};

exports.getauthCode = (req, res) => {
    res.render("authCode");
};

exports.postauthCode = async (req, res) => {
    const token = req.body.token;

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
        return res.status(401).json({ success: false, message: "Token is invalid or expired" });
    }

    req.session.resetToken = token;

    res.status(200).json({ success: true, message: "Your email has been verified", redirectUrl: "/resetPassword" });
};

exports.getresetPassword = (req, res) => {
    const token = req.session.resetToken;

    if (!token) {
        return res.status(400).send("Token is invalid or expired");
    }

    res.render("resetPassword", { token });
};


exports.postresetPassword = async (req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const token = req.body.token;

    if(password !== confirmPassword){
        return res.status(400).json({ success: false, message: "Password doesn't match" });
    }

    if (password.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: "Token is invalid or expired" });
        }

        user.setPassword(password, async (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Something went wrong. Please try again later."});
            }

            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            res.status(200).json({ success: true, message: "Congratulations! Your password has been reset! You can now login!", redirectUrl: "/login" });
        });

    } catch (err) {
            console.log(err);
            res.redirect("/forgotPassword");
        }
};
