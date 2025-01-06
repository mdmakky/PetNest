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
    
        let filter = {};
        
        if (district) {
          filter.district = district;
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
