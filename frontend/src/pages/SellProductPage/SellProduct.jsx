import React, { useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import "./SellProduct.css";

const SellProduct = () => {
  const [productData, setProductData] = useState({
    photo: "",
    name: "",
    category: "",
    subCategory: "",
    quantity: "",
    price: "",
    description: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setProductData({ ...productData, photo: file });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.photo) {
      toast.error("Product photo is required!", {
        position: "top-right",
        autoClose: 3000,
      });

      return;
    }

    if (productData.quantity <= 0 || productData.price <= 0) {
      toast.error("Quantity and price must be positive values!", {
        position: "top-right",
        autoClose: 3000,
      });
      
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("productName", productData.name);
    formData.append("category", productData.category);
    formData.append("subCategory", productData.subCategory);
    formData.append("quantity", productData.quantity);
    formData.append("price", productData.price);
    formData.append("description", productData.description);

    if (productData.photo && typeof productData.photo !== "string") {
      formData.append("productImage", productData.photo);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/product/addProduct",
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
            window.location.href = "/sellProduct";
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

      <div className="add-product-page">
        <div className="add-product-main">
          <div className="add-product-container">
            <form onSubmit={handleSubmit} className="add-product-form">
              <div className="add-product-pic">
                <img src={previewImage || "/images/pet.jpeg"} alt="Product" />
                <div className="image-buttons">
                  <label className="upload-product-btn">
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

              <div className="product-form-fields">
                <label>Product Name:</label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  required
                />

                <label>Category:</label>
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Pet">Pet</option>
                  <option value="Pet Food">Pet Food</option>
                  <option value="Pet Accessories">Pet Accessories</option>
                </select>

                {productData.category === "Pet" && (
                  <>
                    <label>Sub-Category:</label>
                    <select
                      name="subCategory"
                      value={productData.subCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Pet</option>
                      <option value="Cat">Cat</option>
                      <option value="Dog">Dog</option>
                      <option value="Bird">Bird</option>
                      <option value="Fish">Fish</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Others">Others</option>
                    </select>
                  </>
                )}

                {productData.category === "Pet Food" && (
                  <>
                    <label>Sub-Category:</label>
                    <select
                      name="subCategory"
                      value={productData.subCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Food</option>
                      <option value="Dog Food">Dog Food</option>
                      <option value="Cat Food">Cat Food</option>
                      <option value="Bird Seeds">Bird Seeds</option>
                      <option value="Fish Flakes">Fish Flakes</option>
                      <option value="Rabbit Pellets">Rabbit Pellets</option>
                      <option value="Others">Others</option>
                    </select>
                  </>
                )}

                {productData.category === "Pet Accessories" && (
                  <>
                    <label>Sub-Category:</label>
                    <select
                      name="subCategory"
                      value={productData.subCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Accessory</option>
                      <option value="Leash">Leash</option>
                      <option value="Collar">Collar</option>
                      <option value="Cage">Cage</option>
                      <option value="Aquarium">Aquarium</option>
                      <option value="Pet Bed">Pet Bed</option>
                      <option value="Pet Toy">Pet Toy</option>
                      <option value="Others">Others</option>
                    </select>
                  </>
                )}

                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={productData.quantity}
                  onChange={handleInputChange}
                  required
                />

                <label>Price (in Tk):</label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  required
                />

                <label>Description:</label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>

                <button
                  type="submit"
                  className="product-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="white" />
                  ) : (
                    "Add Product"
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

export default SellProduct;
