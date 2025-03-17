const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    doctorImage: String,
    doctorName: String,
    speciality: String,
    hospital: String,
    district: String,
    address: String,
    contact: String,
    verificationDocument: {
        type: String,
        required: [true, "Verification document is required"]
      },
    approved: {
        type: Boolean,
        default: false
    }
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;