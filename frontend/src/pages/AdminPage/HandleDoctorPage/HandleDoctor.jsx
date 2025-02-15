import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Typography } from "@mui/material";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "./HandleDoctor.css";
import AdminBar from "../../../components/AdminBar/AdminBar";

const HandleDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorPerPage = 5;
  const [totalDoctors, setTotalDoctors] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, [currentPage]);

  const fetchDoctors = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/adminDoctor/getDoctor?page=${currentPage}&limit=${doctorPerPage}&approved=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        toast.error("Please login first.");
        navigate("/adminLogin");
        return;
      }

      const data = await response.json();
      setDoctors(data.doctors || []);
      setTotalDoctors(data.total || 0);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to fetch doctors.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to approve this doctor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/admin/adminDoctor/approve/${id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.ok) {
            toast.success("Doctor approved successfully!");
            fetchDoctors();
          } else {
            toast.error("Failed to approve doctor.");
          }
        } catch (error) {
          toast.error("Error approving doctor.");
        }
      }
    });
  };

  const handleDecline = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to decline this doctor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, decline!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/admin/adminDoctor/decline/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.ok) {
            toast.success("Doctor declined successfully!");
            fetchDoctors();
          } else {
            toast.error("Failed to decline doctor.");
          }
        } catch (error) {
          toast.error("Error declining doctor.");
        }
      }
    });
  };

  const handleNextPage = () => {
    if (currentPage * doctorPerPage < totalDoctors) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <AdminBar />

      <div className="handle-doctor-container">
        <Typography variant="h4" className="handle-doctor-title">
          Pending Doctor Approvals
        </Typography>

        {loading ? (
          <div className="handle-doctor-loading">
            <CircularProgress />
          </div>
        ) : doctors.length === 0 ? (
          <Typography variant="h6" align="center" className="handle-doctor-title">
            No pending doctors for approval.
          </Typography>
        ) : (
          <div className="handle-doctor-doctor-list">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="handle-doctor-doctor-card">
                <img
                  src={doctor.doctorImage || "/public/images/doctor.png"}
                  alt={doctor.doctorName}
                  className="handle-doctor-doctor-image"
                />
                <div className="handle-doctor-doctor-info">
                  <h3>{doctor.doctorName}</h3>
                  <p>
                    <strong>Speciality:</strong> {doctor.speciality}
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
                <div className="handle-doctor-doctor-actions">
                  <button
                    className="handle-doctor-accept-btn"
                    onClick={() => handleApprove(doctor._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="handle-doctor-decline-btn"
                    onClick={() => handleDecline(doctor._id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="handle-doctor-pagination-buttons">
          <Button
            onClick={handlePreviousPage}
            variant="outlined"
            disabled={currentPage === 1}
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
                color: "primary.main",
              },
              marginTop: "16px",
            }}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            variant="outlined"
            disabled={currentPage * doctorPerPage >= totalDoctors}
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
                color: "primary.main",
              },
              marginTop: "16px",
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HandleDoctor;
