import React, { useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import "./GiveAdopt.css";

const GiveAdopt = () => {
  const [petData, setPetData] = useState({
    photo: "",
    name: "",
    category: "",
    subCategory: "",
    quantity: "",
    description: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setPetData({ ...petData, photo: file });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!petData.photo) {
      toast.error("Product photo is required!", {
        position: "top-right",
        autoClose: 3000,
      });

      return;
    }

    if (petData.quantity <= 0) {
      toast.error("Quantity must be a positive value!", {
        position: "top-right",
        autoClose: 3000,
      });
      
      return;
    }

    setLoading(true);

    const formData = new FormData();
    
    formData.append("petName", petData.name);
    formData.append("category", petData.category);
    formData.append("quantity", petData.quantity);
    formData.append("description", petData.description);

    if (petData.photo && typeof petData.photo !== "string") {
      formData.append("petImage", petData.photo);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/adoption/giveAdopt",
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
            window.location.href = "/giveAdopt";
          },
        });
      } else {
        toast.error(result.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error during submission:", err);
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

      <div className="give-adopt-page">
        <div className="give-adopt-main">
          <div className="give-adopt-container">
            <form onSubmit={handleSubmit} className="give-adopt-form">
              <div className="give-adopt-pic">
                <img src={previewImage || "/images/pet.jpeg"} alt="Pet" />
                <div className="image-buttons">
                  <label className="give-adopt-upload-btn">
                    Upload Photo
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                    />
                  </label>
                </div>
              </div>

              <div className="give-adopt-form-fields">
                <label>Pet Name:</label>
                <input
                  type="text"
                  name="name"
                  value={petData.name}
                  onChange={handleInputChange}
                  required
                />

                <label>Category:</label>
                <select
                  name="category"
                  value={petData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Cat">Cat</option>
                  <option value="Dog">Dog</option>
                  <option value="Bird">Bird</option>
                  <option value="Fish">Fish</option>
                  <option value="Rabbit">Rabbit</option>
                </select>

                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={petData.quantity}
                  onChange={handleInputChange}
                  required
                />

                <label>Description:</label>
                <textarea
                  name="description"
                  value={petData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>

                <button
                  type="submit"
                  className="give-adopt-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="white" />
                  ) : (
                    "Give Adopt"
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

export default GiveAdopt;
