import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  Typography,
  CircularProgress,
  TextField,
  Container,
  Box,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import "react-toastify/dist/ReactToastify.css";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import "./ConsultDoctor.css";

const ConsultDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [formData, setFormData] = useState({
    doctorName: "",
    speciality: "",
    hospital: "",
    address: "",
    contact: "",
    districtName: "",
    doctorImage: null,
    district,
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const districts = [
    "Bagerhat",
    "Bandarban",
    "Barguna",
    "Barisal",
    "Bhola",
    "Bogra",
    "Brahmanbaria",
    "Chandpur",
    "Chittagong",
    "Chuadanga",
    "Comilla",
    "Cox's Bazar",
    "Dhaka",
    "Dinajpur",
    "Faridpur",
    "Feni",
    "Gaibandha",
    "Gazipur",
    "Gopalganj",
    "Habiganj",
    "Jashore",
    "Jhenaidah",
    "Jhalokati",
    "Jamalpur",
    "Joypurhat",
    "Khagrachari",
    "Khulna",
    "Kishoreganj",
    "Kurigram",
    "Kushtia",
    "Lalmonirhat",
    "Lakshmipur",
    "Magura",
    "Madaripur",
    "Manikganj",
    "Maulvibazar",
    "Meherpur",
    "Munshiganj",
    "Mymensingh",
    "Narayanganj",
    "Narail",
    "Narsingdi",
    "Natore",
    "Naogaon",
    "Nawabganj",
    "Netrokona",
    "Nilphamari",
    "Noakhali",
    "Pabna",
    "Panchagarh",
    "Patuakhali",
    "Pirojpur",
    "Rajbari",
    "Rajshahi",
    "Rangamati",
    "Rangpur",
    "Satkhira",
    "Shariatpur",
    "Sherpur",
    "Sirajgonj",
    "Sunamganj",
    "Sylhet",
    "Tangail",
    "Thakurgaon",
  ];

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/doctor/getDoctor?page=${page}&district=${district}`
      );
      const data = await response.json();
      setDoctors(data.doctors);
      setTotalDoctors(data.totalDoctors);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching doctors.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [page, district]);

  const formRef = useRef(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, doctorImage: e.target.files[0] });
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        verificationDocument: file,
        verificationDocumentUrl: null,
      }));
    }
  };

  const handleJoinClick = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/doctor/request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Request submitted successfully! Wait for the approval.");
        setFormData({
          doctorName: "",
          speciality: "",
          hospital: "",
          address: "",
          contact: "",
          district: "",
          doctorImage: null,
          verificationDocument: null, 
        });
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (error) {
      toast.error("Error submitting request.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <NavBar />
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6, mt: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: '#2c3e50',
              mb: 2,
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Find Your Pet's Doctor
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#666',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400
            }}
          >
            Connect with experienced veterinarians in your area
          </Typography>
        </Box>

        <div className="doctor-filter-container">
          <FormControl size="small">
            <Select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              displayEmpty
              startAdornment={<LocationOnIcon sx={{ mr: 1, color: '#4CAF50' }} />}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4CAF50',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4CAF50',
                },
              }}
            >
              <MenuItem value="">All Districts</MenuItem>
              {districts.map((districtName) => (
                <MenuItem key={districtName} value={districtName}>
                  {districtName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button 
            className="join" 
            variant="contained" 
            onClick={handleJoinClick}
            startIcon={<MedicalServicesIcon />}
          >
            Join as Doctor
          </Button>
        </div>

        {loading ? (
          <div className="loading-container">
            <CircularProgress size={60} />
          </div>
        ) : (
          <div className="doctor-cards">
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <Paper 
                  elevation={0} 
                  className="doctor-card" 
                  key={doctor._id}
                >
                  <img
                    src={doctor.doctorImage || "/images/doctor.png"}
                    alt={doctor.doctorName}
                    className="doctor-photo"
                  />
                  <div className="doctor-card-content">
                    <h6>{doctor.doctorName}</h6>
                    <p>
                      <MedicalServicesIcon sx={{ mr: 1, color: '#4CAF50', verticalAlign: 'middle' }} />
                      <strong>Specialty:</strong> {doctor.speciality}
                    </p>
                    <p>
                      <LocalHospitalIcon sx={{ mr: 1, color: '#4CAF50', verticalAlign: 'middle' }} />
                      <strong>Hospital:</strong> {doctor.hospital}
                    </p>
                    <p>
                      <LocationOnIcon sx={{ mr: 1, color: '#4CAF50', verticalAlign: 'middle' }} />
                      <strong>District:</strong> {doctor.district}
                    </p>
                    <p>
                      <strong>Address:</strong> {doctor.address}
                    </p>
                    <p>
                      <PhoneIcon sx={{ mr: 1, color: '#4CAF50', verticalAlign: 'middle' }} />
                      <strong>Contact:</strong> {doctor.contact}
                    </p>
                  </div>
                </Paper>
              ))
            ) : (
              <Paper 
                elevation={0} 
                className="no-doctors-message"
              >
                <MedicalServicesIcon sx={{ fontSize: 48, color: '#4CAF50', mb: 2 }} />
                <Typography variant="h6">
                  No doctors found in this district.
                </Typography>
              </Paper>
            )}
          </div>
        )}

        <div ref={formRef} className="doctor-form-container">
          <Typography variant="h5">Join Our Veterinary Network</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="doctorName"
              label="Full Name"
              fullWidth
              required
              onChange={handleFormChange}
              value={formData.doctorName}
            />
            <TextField
              name="speciality"
              label="Speciality"
              fullWidth
              required
              onChange={handleFormChange}
              value={formData.speciality}
            />
            <TextField
              name="hospital"
              label="Hospital/Clinic Name"
              fullWidth
              required
              onChange={handleFormChange}
              value={formData.hospital}
            />
            <TextField
              name="address"
              label="Address"
              fullWidth
              required
              multiline
              rows={2}
              onChange={handleFormChange}
              value={formData.address}
            />
            <FormControl fullWidth>
              <Select
                name="district"
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                displayEmpty
                required
                sx={{ textAlign: "left" }}
              >
                <MenuItem value="">Select Your District</MenuItem>
                {districts.map((districtName) => (
                  <MenuItem key={districtName} value={districtName}>
                    {districtName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="contact"
              label="Contact Number"
              fullWidth
              required
              onChange={handleFormChange}
              value={formData.contact}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom className="doctor-image-label">
                Upload Your Photo
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ textAlign: "left" }}
              >
                <input type="file" hidden onChange={handleImageChange} />
                {formData.doctorImage?.name || "Choose File"}
              </Button>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom className="doctor-image-label">
                Upload Verification Document (PDF)
              </Typography>
              <Typography className="note" variant="subtitle1" gutterBottom>
                Document can be Veterinary License, Educational Certificates, BVC Registration Certificate, Hospital/Clinic Affiliation
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ textAlign: "left" }}
              >
                <input
                  type="file"
                  hidden
                  onChange={handleDocumentChange}
                  accept="application/pdf"
                  required
                />
                {formData.verificationDocument?.name || "Choose PDF File"}
              </Button>
            </FormControl>

            <Button 
              type="submit" 
              variant="contained" 
              disabled={loadingSubmit}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: '12px',
                textTransform: 'none',
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: '#4CAF50',
                '&:hover': {
                  backgroundColor: '#45a049',
                },
              }}
            >
              {loadingSubmit ? (
                <CircularProgress size={24} color="white" />
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </div>
      </Container>
      <Footer />
    </Box>
  );
};

export default ConsultDoctor;
