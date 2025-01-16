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

exports.getUserAdoption = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Please login first." });
    }

    const pets = await Adoption.find({ userId: req.user.id });

    if (pets.length === 0) {
      return res.status(404).json({ success: false, message: "No pets found." });
    }

    return res.status(200).json({
      success: true,
      message: "Pets retrieved successfully.",
      pets,
    });
  } catch (error) {
    console.error("Error retrieving pets:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the pets.",
    });
  }
};


exports.updateAdoption = async (req, res) => {
  const { petId, petName, category, quantity, description } = req.body;

  try {

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!petId) {
      return res.status(400).json({ success: false, message: "Pet ID is required." });
    }

    const pet = await Adoption.findOne({ _id: petId, userId: req.user.id });

    if (!pet) {
      return res.status(404).json({ success: false, message: "Pet not found." });
    }

    if (req.file) {
      const newImageUrl = await uploadImageToCloudinary(
        req.file.buffer,
        "pets",
        `${req.user.id}/${petName}`,
        true
      );
      pet.petImage = newImageUrl;
    }

    pet.petName = petName || pet.petName;
    pet.category = category || pet.category;
    pet.quantity = quantity || pet.quantity;
    pet.description = description || pet.description;

    await pet.save();

    return res.status(200).json({
      success: true,
      message: "Pet updated successfully.",
      pet,
    });
  } catch (error) {
    console.error("Error updating pet:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the pet.",
    });
  }
};

exports.deleteAdoption = async (req, res) => {
  const { petId } = req.body;

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!petId) {
      return res.status(400).json({ success: false, message: "Pet ID is required." });
    }

    const pet = await Adoption.findOneAndDelete({ _id: petId, userId: req.user.id });

    if (!pet) {
      return res.status(404).json({ success: false, message: "Pet not found or already deleted." });
    }

    return res.status(200).json({
      success: true,
      message: "Pet deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting pet:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the pet.",
    });
  }
};