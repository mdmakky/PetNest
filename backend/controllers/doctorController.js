const Doctor = require("../models/Doctor");
const multer = require("multer");
const { uploadImageToCloudinary } = require("../utils/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.getDoctor = async (req, res) => { 
    try {
        const { page = 1, district = "" } = req.query;
        const pageNumber = parseInt(page);
        const itemsPerPage = 12;
        const skip = (pageNumber - 1) * itemsPerPage;
    
        let filter = {approved: true};
        
        if (district) {
          filter.districtName = district;
        }
    
        const doctors = await Doctor.find(filter) 
          .skip(skip)
          .limit(itemsPerPage)
          .exec();
        const totalDoctors = await Doctor.countDocuments(filter); 
    
        res.json({ doctors, totalDoctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching doctors." });
    }
};


exports.addDoctor = [
  upload.single("doctorImage"),
  async (req, res) => {
    const { doctorName, speciality, hospital, district, address, contact} = req.body;
    
    try {
      let doctorImageUrl = "";

      if (req.file) {
        doctorImageUrl= await uploadImageToCloudinary(
          req.file.buffer,
          "doctors",
          `${req.user.id}/${doctorName}`, 
          true 
        );
      }

      const newDoctor = new Doctor({
        doctorImage: doctorImageUrl,
        doctorName,
        speciality,
        hospital,
        district,
        address,
        contact
      });

      await newDoctor.save();

      return res.status(201).json({
        success: true,
        product: newDoctor,
      });
    } catch (error) {
      console.error("Error adding doctor:", error.message, error.stack);
      return res.status(500).json({
        success: false,
        message: "An error occurred while adding the doctor.",
      });
    }
  },
];
