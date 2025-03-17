import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress, Typography } from "@mui/material";
import PetsIcon from '@mui/icons-material/Pets';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import "./ManageAdopt.css";

const ManageAdopt = () => {
  const [pets, setPets] = useState([]);
  const [editingPetId, setEditingPetId] = useState(null);
  const [petData, setPetData] = useState({
    petName: "",
    category: "",
    quantity: "",
    description: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/adoption/getUserAdoption", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setPets(result.pets);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
        toast.error("Failed to load pets.");
      }
    };

    fetchPets();
  }, []);

  const handleEditClick = (adoption) => {
    setEditingPetId(adoption._id);
    setPetData(adoption);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

  const handleUpdateAdoption = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/adoption/updateAdoption", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...petData, petId: editingPetId }),
      });

      const result = await response.json();
      if (result.success && result.pet) {
        toast.success(result.message || "Pet details updated successfully.");
        setPets((prevPets) =>
          prevPets.map((adoption) =>
            adoption._id === editingPetId ? result.pet : adoption
          )
        );
        setEditingPetId(null);
      } else {
        toast.error(result.message || "Unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error updating pet details:", error);
      toast.error("Failed to update pet details.");
    }
    setIsUpdating(false);
  };

  const handleDeletePet = async (petId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/adoption/deleteAdoption", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ petId }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Pet deleted successfully.");
        setPets(pets.filter((adoption) => adoption._id !== petId));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting pet details:", error);
      toast.error("Failed to delete pet details.");
    }
  };

  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + "...";
    }
    return description;
  };

  return (
    <div>
      <SideBar />
      <div className="update-adoption-page">
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
          My Adoptions
        </Typography>
        <div className="update-adoption-list">
          {pets.map((adoption) => (
            <div className="update-adoption-card" key={adoption._id}>
              {editingPetId === adoption._id ? (
                <form onSubmit={handleUpdateAdoption} className="updateAdoption-edit-form">
                  <label>
                    <PetsIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                    Pet Name
                  </label>
                  <input
                    type="text"
                    name="petName"
                    value={petData.petName}
                    onChange={handleInputChange}
                    placeholder="Enter pet name"
                    required
                  />
                  <label>
                    <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={petData.category}
                    onChange={handleInputChange}
                    placeholder="Enter category"
                    required
                  />
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
                  <button type="submit" className="updateAdoption-save-btn">
                    {isUpdating ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <SaveIcon sx={{ mr: 1 }} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="updateAdoption-cancel-btn"
                    onClick={() => setEditingPetId(null)}
                  >
                    <CancelIcon sx={{ mr: 1 }} />
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <img src={adoption.petImage || "/images/default-adoption.jpeg"} alt={adoption.petName} />
                  <h3>{adoption.petName}</h3>
                  <p>
                    <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                    Category: {adoption.category}
                  </p>
                  <p>
                    <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                    Quantity: {adoption.quantity}
                  </p>
                  <p>
                    <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                    {truncateDescription(adoption.description)}
                  </p>
                  <div className="update-adoption-actions">
                    <button
                      className="updateAdoption-btn"
                      onClick={() => handleEditClick(adoption)}
                    >
                      <EditIcon sx={{ mr: 1 }} />
                      Update
                    </button>
                    <button
                      className="deleteAdoption-btn"
                      onClick={() => handleDeletePet(adoption._id)}
                    >
                      <DeleteIcon sx={{ mr: 1 }} />
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ManageAdopt;
