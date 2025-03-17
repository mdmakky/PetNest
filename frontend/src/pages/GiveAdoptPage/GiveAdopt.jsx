import React, { useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress, Typography } from "@mui/material";
import PetsIcon from '@mui/icons-material/Pets';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
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
            <Typography variant="h4" gutterBottom sx={{ 
              color: '#2c3e50', 
              fontWeight: 600, 
              textAlign: 'center',
              mb: 3,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '3px',
                background: 'linear-gradient(to right, #4CAF50, #45a049)',
                borderRadius: '2px'
              }
            }}>
              <PetsIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
              Give for Adoption
            </Typography>
            <form onSubmit={handleSubmit} className="give-adopt-form">
              <div className="give-adopt-pic">
                <img src={previewImage || "/images/pet.jpeg"} alt="Pet" />
                <div className="image-buttons">
                  <label className="give-adopt-upload-btn">
                    <PhotoCameraIcon sx={{ mr: 1 }} />
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
                <label>
                  <PetsIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                  Pet Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={petData.name}
                  onChange={handleInputChange}
                  placeholder="Enter pet name"
                  required
                />

                <label>
                  <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                  Category
                </label>
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

                <label>
                  <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={petData.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                  required
                />

                <label>
                  <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                  Description
                </label>
                <textarea
                  name="description"
                  value={petData.description}
                  onChange={handleInputChange}
                  placeholder="Enter pet description"
                  required
                ></textarea>

                <button
                  type="submit"
                  className="give-adopt-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      <SaveIcon sx={{ mr: 1 }} />
                      Give for Adoption
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

export default GiveAdopt;
