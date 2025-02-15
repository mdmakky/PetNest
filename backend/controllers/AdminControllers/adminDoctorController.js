const Doctor = require("../../models/Doctor");

exports.getDoctors = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    try {
      const doctors = await Doctor.find({ approved: false })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });
  
      const total = await Doctor.countDocuments({ approved: false });
  
      res.json({ doctors, total });
    } catch (error) {
      console.error("Error fetching doctors:", error);
      res.status(500).json({ message: "Server error" });
    }
};
  

exports.approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor approved successfully", doctor });
  } catch (error) {
    console.error("Error approving doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.declineDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor declined successfully" });
  } catch (error) {
    console.error("Error declining doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};
