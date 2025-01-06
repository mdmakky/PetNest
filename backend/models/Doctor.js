const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    doctorImage: String,
    doctorName: String,
    specialty: String,
    hospital: String,
    district: String,
    address: String,
    contact: String
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;