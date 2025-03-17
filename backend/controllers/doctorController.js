const Doctor = require("../models/Doctor");
const multer = require("multer");
const { uploadImageToCloudinary } = require("../utils/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'verificationDocument') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'), false);
      }
    } else {
      cb(null, true);
    }
  }
});

exports.getDoctor = async (req, res) => { 
    try {
        const { page = 1, district = "" } = req.query;
        const pageNumber = parseInt(page);
        const itemsPerPage = 12;
        const skip = (pageNumber - 1) * itemsPerPage;
    
        let filter = {approved: true};
        
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


exports.addDoctor = [
  upload.fields([
    { name: 'doctorImage', maxCount: 1 },
    { name: 'verificationDocument', maxCount: 1 }
  ]),
  async (req, res) => {
    const { 
      doctorName, 
      speciality, 
      hospital, 
      district, 
      address, 
      contact,
    } = req.body;

    try {
      if (!req.files?.verificationDocument) {
        return res.status(400).json({
          success: false,
          message: "Verification document is required"
        });
      }
      const uploadPromises = [];
      
      if (req.files.doctorImage) {
        uploadPromises.push(
          uploadImageToCloudinary(
            req.files.doctorImage[0].buffer,
            "doctors",
            `${doctorName}-profile`,
            true
          )
        );
      }
      uploadPromises.push(
        uploadImageToCloudinary(
          req.files.verificationDocument[0].buffer,
          "verification-docs",
          `${doctorName}-${contact}`,
          true,
          'raw' 
        )
      );

      const [doctorImageUrl, verificationDocUrl] = await Promise.all(uploadPromises);

      const newDoctor = new Doctor({
        doctorImage: doctorImageUrl || null,
        verificationDocument: verificationDocUrl,
        doctorName,
        speciality,
        hospital,
        district,
        address,
        contact,
        approved: false
      });

      await newDoctor.save();

      return res.status(201).json({
        success: true,
        message: "Application submitted for review",
        doctor: newDoctor
      });

    } catch (error) {
      console.error("Doctor registration error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Registration failed. Please try again."
      });
    }
  }
];