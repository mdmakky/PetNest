const User = require("../models/user");
const passport = require("passport");
const multer = require('multer');
const path = require('path');
const { bucket } = require('../firebase');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


exports.getProfile = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }

    User.findById(req.user._id).then(function (foundUser) {
        if (foundUser) {
            res.render("profile", { 
                userName: foundUser.name,
                userAddress: foundUser.address,
                userPhone: foundUser.phone,
                userEmail: foundUser.email,
                userDOB: foundUser.dob,
                userGender: foundUser.gender,
                userImage: foundUser.profileImage,
            });
        } else {
            res.status(404).send("User not found");
        }
    }).catch(function (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    });
};


exports.getEditProfile = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }

    User.findById(req.user._id).then(function (foundUser) {
        if (foundUser) {
            res.render("editProfile", { 
                userName: foundUser.name,
                userAddress: foundUser.address,
                userPhone: foundUser.phone,
                userDOB: foundUser.dob,
                userGender: foundUser.gender,
                userImage: foundUser.profileImage,
                userId: req.user._id
            });
        } else {
            res.status(404).send("User not found");
        }
    }).catch(function (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    });
};

exports.postEditProfile = [
    upload.single('profileImage'),

    async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.json({
          success: false,
          message: "You are not authenticated. Please log in.",
        });
      }
  
      const { name, address, phone, nid, dob, gender } = req.body;
  
      const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

      if (!phoneRegex.test(phone)) {
        return res.json({
          success: false,
          message: "Invalid phone number",
        });
      }
  
      try {
        let profileImageUrl;
        if (req.file) {
          const fileName = `PetNest/${Date.now()}-${req.file.originalname}`;
          const file = bucket.file(fileName);
  
          await file.save(req.file.buffer, {
            metadata: { contentType: req.file.mimetype },
            public: true,
          });
  
          profileImageUrl = file.publicUrl();
        }
  
        const user = await User.findById(req.user._id);
  
        if (user) {
          user.name = name;
          user.address = address;
          user.phone = phone;
          user.nid = nid;
          user.dob = dob;
          user.gender = gender;
          if (profileImageUrl) {
            user.profileImage = profileImageUrl;
          }
          user.profileComplete = true;
          await user.save();
          return res.json({
            success: true,
            message: "Profile updated successfully!",
          });
        } else {
          return res.status(404).json({
            success: false,
            message: "User not found.",
          });
        }
      } catch (err) {
        console.error(err);
        return res.json({
          success: false,
          message: "An error occurred while updating your profile.",
        });
      }
    },
  ];  


exports.removeProfilePic = async (req, res) => {
    const { userId } = req.body;

    try {
      const user = await User.findById(userId);
  
      if (user) {
        if (user.profileImage) {
          const fileName = user.profileImage.split('/').pop();
          const file = bucket.file(`profile-images/${fileName}`);
  
          await file.delete().catch((err) => {
            console.error("Error deleting from Firebase:", err);
          });
        }
  
        user.profileImage = null;
        await user.save();
  
        res.json({ success: true });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
};
