import React, { useEffect, useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    gender: "",
    address: "",
    dob: "",
    phone: "",
    nid: "",
    profileImage: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
        setPreviewImage(data.profileImage || "https://via.placeholder.com/150");
      } catch (err) {
        console.error("Error fetching user data:", err);
        setPreviewImage("https://via.placeholder.com/150");
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setUserData({ ...userData, profileImage: file });
    }
  };

  const handleDeleteImage = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = userData.userId;

      setLoadingMore(true);

      const response = await fetch(
        "http://localhost:3000/api/user/removeProfilePic",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Profile picture removed successfully!");
        setPreviewImage("https://via.placeholder.com/150");
        setUserData({ ...userData, profileImage: "" });
      } else {
        toast.error(result.message || "Failed to remove profile image.");
      }
    } catch (error) {
      console.error("Error deleting profile image:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("gender", userData.gender);
    formData.append("address", userData.address);
    formData.append("dob", userData.dob);
    formData.append("phone", userData.phone);
    formData.append("nid", userData.nid);

    if (userData.profileImage && typeof userData.profileImage !== "string") {
      formData.append("profileImage", userData.profileImage);
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/user/editProfile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(result.message, {
          position: "top-right",
          autoClose: 3000,
          onClose: () => {
            window.location.href = result.redirectUrl || "/profile";
          },
        });
      } else {
        toast.error(result.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SideBar />

      <div className="edit-profile-page">
        <div className="edit-profile-main">
          <div className="edit-profile-container">
            <form onSubmit={handleSubmit} className="edit-profile-form">
              <div className="edit-profile-pic">
                <img src={previewImage} alt="Profile" />
                <div className="image-buttons">
                  <label className="upload-btn">
                    <PhotoCameraIcon />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                  </label>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={handleDeleteImage}
                  >
                    <DeleteIcon />
                    Delete Photo
                    {loadingMore && <CircularProgress size={20} color="inherit" />}
                  </button>
                </div>
              </div>

              <div className="form-fields">
                <label>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                />

                <label>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                  Gender
                </label>
                <select
                  name="gender"
                  value={userData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <label>
                  <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                />

                <label>
                  <CakeIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={userData.dob}
                  onChange={handleInputChange}
                />

                <label>
                  <PhoneIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />

                <label>
                  <BadgeIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                  NID
                </label>
                <input
                  type="text"
                  name="nid"
                  value={userData.nid || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your NID number"
                />

                <label>
                  <EmailIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={userData.email || ""}
                  disabled
                />

                <button type="submit" className="save-btn">
                  {loading ? (
                    <CircularProgress size={24} color="white" />
                  ) : (
                    <>
                      <SaveIcon sx={{ mr: 1 }} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Profile;
