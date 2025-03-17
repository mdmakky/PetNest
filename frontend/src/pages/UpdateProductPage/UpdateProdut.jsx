import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DescriptionIcon from '@mui/icons-material/Description';
import "./UpdateProduct.css";

const UpdateProduct = () => {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productData, setProductData] = useState({
    productName: "",
    category: "",
    quantity: "",
    price: "",
    description: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/api/product/getUserProduct",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          setProducts(result.products);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products.");
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setProductData(product);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/product/updateProduct",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...productData, productId: editingProductId }),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Product updated successfully.");
        setProducts(
          products.map((product) =>
            product._id === editingProductId ? result.product : product
          )
        );
        setEditingProductId(null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    }
    setIsUpdating(false);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/product/deleteProduct",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Product deleted successfully.");
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
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
      <div className="update-product-page">
        <h2>My Products</h2>
        <div className="update-product-list">
          {products.map((product) => (
            <div className="update-product-card" key={product._id}>
              {editingProductId === product._id ? (
                <form
                  onSubmit={handleUpdateProduct}
                  className="updateProduct-edit-form"
                >
                  <div>
                    <label>
                      <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={productData.productName}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label>
                      <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={productData.category}
                      onChange={handleInputChange}
                      placeholder="Enter category"
                      required
                    />
                  </div>

                  <div>
                    <label>
                      <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={productData.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                      required
                    />
                  </div>

                  <div>
                    <label>
                      <LocalOfferIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={productData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                      required
                    />
                  </div>

                  <div>
                    <label>
                      <LocalOfferIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                      Discount Price (optional)
                    </label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={productData.discountPrice || ""}
                      onChange={handleInputChange}
                      placeholder="Enter discount price"
                      min="0"
                    />
                  </div>

                  <div>
                    <label>
                      <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={productData.description}
                      onChange={handleInputChange}
                      placeholder="Enter description"
                      required
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="update-save-btn">
                      {isUpdating ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <>
                          <SaveIcon />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="update-cancel-btn"
                      onClick={() => setEditingProductId(null)}
                    >
                      <CancelIcon />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <img
                    src={product.productImage || "/images/default-product.jpeg"}
                    alt={product.productName}
                  />
                  <h3>{product.productName}</h3>
                  <p>
                    <CategoryIcon />
                    Category: {product.category}
                  </p>
                  <p>
                    <InventoryIcon />
                    Quantity: {product.quantity}
                  </p>
                  {product.discountPrice ? (
                    <>
                      <p className="original-price">
                        <LocalOfferIcon />
                        Original Price: Tk {product.price}
                      </p>
                      <p className="discounted-price">
                        <LocalOfferIcon />
                        Discounted Price: Tk {product.discountPrice}
                      </p>
                    </>
                  ) : (
                    <p>
                      <LocalOfferIcon />
                      Price: Tk {product.price}
                    </p>
                  )}
                  <p>
                    <DescriptionIcon />
                    {truncateDescription(product.description)}
                  </p>
                  <div className="update-product-actions">
                    <button
                      className="updateProduct-btn"
                      onClick={() => handleEditClick(product)}
                    >
                      <EditIcon />
                      Update
                    </button>
                    <button
                      className="deleteProduct-btn"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <DeleteIcon />
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateProduct;
