import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminBar from "../../../components/AdminBar/AdminBar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress, Button } from "@mui/material";
import { marked } from "marked";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";
import "./HandleBlog.css";

const HandleBlog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;
  const [totalBlogs, setTotalBlogs] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/admin/adminBlog/getBlog?page=${currentPage}&limit=${blogsPerPage}&accept=false`,
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
        setBlogs(data.blogs || []);
        setTotalBlogs(data.total || 0);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to fetch blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, navigate]);

  const handleApprove = async (id) => {
    const confirmApprove = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve this blog!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Confirm",
    });

    if (confirmApprove.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/admin/adminBlog/approve/${id}`,
          {
            method: "PUT",
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
        if (response.ok) {
          toast.success("Blog approved successfully");
          setBlogs(blogs.filter((blog) => blog._id !== id));
        } else {
          toast.error("Failed to approve blog");
        }
      } catch (error) {
        console.error("Error approving blog:", error);
      }
    }
  };

  const handleDecline = async (id) => {
    const confirmDecline = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to decline this blog!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#28a745",
      confirmButtonText: "Confirm",
    });

    if (confirmDecline.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/admin/adminBlog/decline/${id}`,
          {
            method: "DELETE",
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
        if (response.ok) {
          toast.success("Blog declined successfully");
          setBlogs(blogs.filter((blog) => blog._id !== id));
        } else {
          toast.error("Failed to decline blog");
        }
      } catch (error) {
        console.error("Error declining blog:", error);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage * blogsPerPage < totalBlogs) {
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
      <div className="admin-blog-page">
        {loading ? (
          <div className="loading-container">
            <CircularProgress size={40} color="primary" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="no-blogs-message">
            <p>No blogs available for approval or decline.</p>
          </div>
        ) : (
          <div className="handleBlog-list">
            {blogs.map((blog) => (
              <div key={blog._id} className="handleBlog-card">
                <h3>{blog.title}</h3>
                <p>
                  <strong>Category:</strong>{" "}
                  <span className="category">{blog.category}</span>
                </p>
                <p>
                  <strong>Author:</strong> {blog.userId?.name} (
                  {blog.userId.email})
                </p>
                <p>
                  <strong>Address:</strong> {blog.userId?.address}
                </p>
                <p>
                  <strong>Posted on:</strong>{" "}
                  {new Date(blog.createdAt).toLocaleString()}
                </p>

                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked(blog.content)),
                  }}
                ></div>
                <div className="handleBlog-btn">
                  <button
                    onClick={() => handleApprove(blog._id)}
                    className="handleBlog-accept-btn"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecline(blog._id)}
                    className="handleBlog-decline-btn"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="handleBlog-pagination-buttons">
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
            disabled={currentPage * blogsPerPage >= totalBlogs}
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

export default HandleBlog;
