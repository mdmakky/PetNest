import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import "react-toastify/dist/ReactToastify.css";
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
    <div>
      <NavBar />

      <div className="doctor-filter-container">
        <FormControl className="doctor-filter" size="small">
          <Select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All District</MenuItem>
            {districts.map((districtName) => (
              <MenuItem key={districtName} value={districtName}>
                {districtName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button className="join" variant="contained" onClick={handleJoinClick}>
          Join with us
        </Button>
      </div>

      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <div className="doctor-cards">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div className="doctor-card" key={doctor._id}>
                <img
                  src={doctor.doctorImage || "/images/doctor.png"}
                  alt={doctor.doctorName}
                  className="doctor-photo"
                />
                <h6>{doctor.doctorName}</h6>
                <p>
                  <strong>Specialty:</strong> {doctor.speciality}
                </p>
                <p>
                  <strong>Hospital:</strong> {doctor.hospital}
                </p>
                <p>
                  <strong>District:</strong> {doctor.district}
                </p>
                <p>
                  <strong>Address:</strong> {doctor.address}
                </p>
                <p>
                  <strong>Contact:</strong> {doctor.contact}
                </p>
              </div>
            ))
          ) : (
            <Typography variant="h6" className="no-doctors-message">
              No doctors found in this district.
            </Typography>
          )}
        </div>
      )}

      <div ref={formRef} className="doctor-form-container">
        <Typography variant="h5">Join with us as a Doctor!</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="doctorName"
            label="Name"
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
            label="Hospital"
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
            label="Contact"
            fullWidth
            required
            onChange={handleFormChange}
            value={formData.contact}
          />
          <label className="doctor-image-label">Upload Your Photo</label>
          <input type="file" onChange={handleImageChange} />
          <Button type="submit" variant="contained" disabled={loadingSubmit}>
            {loadingSubmit ? (
              <CircularProgress size={24} color="white" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ConsultDoctor;
