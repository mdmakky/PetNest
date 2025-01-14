const Adoption = require("../models/Adoption");
const multer = require("multer");
const { uploadImageToCloudinary } = require("../utils/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.getAdoption = async (req, res) => {
    const { category, page = 1, limit = 12 } = req.query;
  
    try {
      const query = {};
  
      if (category) {
        query.category = category;
      }
  
      const skip = (page - 1) * limit;
  
      const adoptions = await Adoption.find(query)
        .populate("userId", "name address phone")
        .skip(skip)
        .limit(parseInt(limit));
  
      const totalAdoptions = await Adoption.countDocuments(query);
  
      return res.status(200).json({
        success: true,
        adoptions,
        totalAdoptions,
        totalPages: Math.ceil(totalAdoptions / limit),
        currentPage: parseInt(page),
      });
    } catch (err) {
      console.error("Error fetching adoptions:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch adoptions.",
      });
    }
  };
  

exports.giveAdopt = [
    upload.single("petImage"),
    async (req, res) => {
      const { petName, category, quantity, description } = req.body;
  
      try {
        if (!req.user || !req.user.id) {
          return res
            .status(401)
            .json({ success: false, message: "Please login first!" });
        }
  
        let petImageUrl = "";
  
        if (req.file) {
          petImageUrl = await uploadImageToCloudinary(
            req.file.buffer,
            "pets",
            `${req.user.id}/${petName}`, 
            true 
          );
        }
  
        const newAdoption = new Adoption({
          userId: req.user.id,
          petImage: petImageUrl,
          petName,
          category,
          quantity,
          description,
        });
  
        await newAdoption.save();
  
        return res.status(201).json({
          success: true,
          message: "Pet added successfully for adoption.",
          adoption: newAdoption,
        });
      } catch (error) {
        console.error("Error adding pet:", error.message, error.stack);
        return res.status(500).json({
          success: false,
          message: "An error occurred while adding the pet.",
        });
      }
    },
  ];
  