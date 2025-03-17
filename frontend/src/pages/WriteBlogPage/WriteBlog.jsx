import React, { useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import "./WriteBlog.css";

const Blog = () => {
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData({ ...blogData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/blog/addBlog", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const result = await response.json();
      console.log(result)

      if (response.ok) {
        toast.success("Blog added successfully! Wait for the approval!");
        setBlogData({
          title: "",
          content: "",
          category: "",
        });
      } else {
        console.error("Error while submitting blog:", result);
        toast.error("Failed to add blog");
      }
    } catch (err) {
      console.error("Error during submission:", err);
      toast.error("An error occurred while submitting the blog");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div>
      <SideBar />

      <div className="add-blog-page">
        <div className="add-blog-main">
          <div className="add-blog-container">
            <h2 className="blog-h2">Add New Blog</h2>
            <form onSubmit={handleSubmit} className="add-blog-form">
              <div className="blog-form-fields">
                <label>Blog Title:</label>
                <input
                  type="text"
                  name="title"
                  value={blogData.title}
                  onChange={handleInputChange}
                  required
                />

                <label>Category:</label>
                <select
                  name="category"
                  value={blogData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Pet Care">Pet Care</option>
                  <option value="Pet Nutrition">Pet Nutrition</option>
                  <option value="Training and Behavior">
                    Training and Behavior
                  </option>
                  <option value="Pet Health & Wellness">
                    Pet Health & Wellness
                  </option>
                  <option value="Pet Accessories & Gear">
                    Pet Accessories & Gear
                  </option>
                  <option value="Adoption & Rescue">Adoption & Rescue</option>
                  <option value="Pet Stories & Experiences">
                    Pet Stories & Experiences
                  </option>
                  <option value="Pet Events & Activities">
                    Pet Events & Activities
                  </option>
                  <option value="Breed Information">Breed Information</option>
                  <option value="Pet Safety">Pet Safety</option>
                  <option value="Pet Products">Pet Products</option>
                  <option value="Technology">Technology</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Travel">Travel</option>
                  <option value="Food">Food</option>
                </select>

                <label>Content:</label>
                <textarea
                  name="content"
                  value={blogData.content}
                  onChange={handleInputChange}
                  required
                ></textarea>

                <button
                  type="submit"
                  className="blog-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="white" />
                  ) : (
                    "Add Blog"
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

export default Blog;
