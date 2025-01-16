import React, { useEffect, useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
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
        setPreviewImage(data.profileImage || "/images/user.png");
      } catch (err) {
        console.error("Error fetching user data:", err);
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
        setPreviewImage("/images/user.png");
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
                    {loadingMore ? (
                      <CircularProgress size={24} color="white" />
                    ) : (
                      "Delete Photo"
                    )}
                  </button>
                </div>
              </div>

              <div className="form-fields">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                />

                <label>Gender:</label>
                <select
                  name="gender"
                  value={userData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                />

                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dob"
                  value={userData.dob}
                  onChange={handleInputChange}
                />

                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                />

                <label>NID:</label>
                <input
                  type="text"
                  name="nid"
                  value={userData.nid || ""}
                  onChange={handleInputChange}
                />

                <label>Email:</label>
                <input
                  type="text"
                  name="nid"
                  value={userData.email || ""}
                  disabled
                />

                <button type="submit" className="save-btn">
                  {loading ? (
                    <CircularProgress size={24} color="white" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
