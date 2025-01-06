import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  Typography,
  CircularProgress,
  Card,
  CardContent,
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

  const districts = [
  "Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogra", "Brahmanbaria",
  "Chandpur", "Chittagong", "Chuadanga", "Comilla", "Cox's Bazar", "Dhaka", "Dinajpur",
  "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jashore",
  "Jhenaidah", "Jhalokati", "Jamalpur", "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj",
  "Kurigram", "Kushtia", "Lalmonirhat", "Lakshmipur", "Magura", "Madaripur", "Manikganj",
  "Maulvibazar", "Meherpur", "Munshiganj", "Mymensingh", "Narayanganj", "Narail", "Narsingdi",
  "Natore", "Naogaon", "Nawabganj", "Netrokona", "Nilphamari", "Noakhali", "Pabna",
  "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur",
  "Satkhira", "Shariatpur", "Sherpur", "Sirajgonj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
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

  return (
    <div>
      <NavBar />

      <div className="doctor-filter-container">
        <FormControl size="small">
          <Select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All Districts</MenuItem>
            {districts.map((districtName) => (
              <MenuItem key={districtName} value={districtName}>
                {districtName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

      <div className="doctor-pagination">
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          disabled={page * 12 >= totalDoctors}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ConsultDoctor;
