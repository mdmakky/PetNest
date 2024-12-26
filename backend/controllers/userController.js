const User = require("../models/User");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { uploadImageToCloudinary } = require('../utils/cloudinary');

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
              profileImageUrl = await uploadImageToCloudinary(req.file.buffer, req.user._id); // Pass buffer and optional file name
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

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      if (user.profileImage) {

          const publicId = user.profileImage.split('/').pop().split('.')[0];

          await cloudinary.uploader.destroy(`petnest/${publicId}`)
              .catch((err) => {
                  console.error("Error deleting from Cloudinary:", err);
              });

          user.profileImage = null;
          await user.save();

          return res.json({ success: true, message: "Profile picture removed successfully" });
      } else {
          return res.json({ success: false, message: "No profile picture to remove" });
      }
  } catch (error) {
      console.error("Error removing profile picture:", error);
      res.status(500).json({ success: false, message: "An error occurred" });
  }
};