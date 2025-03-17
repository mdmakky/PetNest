import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
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
        const response = await fetch("http://localhost:3000/api/product/getUserProduct", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
      const response = await fetch("http://localhost:3000/api/product/updateProduct", {
        method: "POST", 
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...productData, productId: editingProductId }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Product updated successfully.");
        setProducts(products.map((product) =>
          product._id === editingProductId ? result.product : product
        ));
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
      const response = await fetch("http://localhost:3000/api/product/deleteProduct", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
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
                <form onSubmit={handleUpdateProduct} className="updateProduct-edit-form">
                  <input
                    type="text"
                    name="productName"
                    value={productData.productName}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    required
                  />
                  <input
                    type="text"
                    name="category"
                    value={productData.category}
                    onChange={handleInputChange}
                    placeholder="Category"
                    required
                  />
                  <input
                    type="number"
                    name="quantity"
                    value={productData.quantity}
                    onChange={handleInputChange}
                    placeholder="Quantity"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    required
                  />
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                  ></textarea>
                  <button type="submit" className="update-save-btn">
                    {isUpdating ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Confirm"
                    )}
                  </button>
                  <button
                    type="button"
                    className="update-cancel-btn"
                    onClick={() => setEditingProductId(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <img src={product.productImage || "/images/default-product.jpeg"} alt={product.productName} />
                  <h3>{product.productName}</h3>
                  <p>Category: {product.category}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Price: Tk {product.price}</p>
                  <p>{truncateDescription(product.description)}</p>
                  <div className="update-product-actions">
                    <button
                      className="updateProduct-btn"
                      onClick={() => handleEditClick(product)}
                    >
                      Update
                    </button>
                    <button
                      className="deleteProduct-btn"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
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

export default UpdateProduct;
