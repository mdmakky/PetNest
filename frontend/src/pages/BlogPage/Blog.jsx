import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  TextField,
  Card,
  CardContent,
  Avatar,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar/NavBar";
import "react-toastify/dist/ReactToastify.css";
import "./Blog.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [commentData, setCommentData] = useState({});
  const [loading, setLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const blogsPerPage = 6;
  const truncateLength = 150;

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/blog/getBlog?page=${currentPage}&limit=${blogsPerPage}`
      );
      const data = await response.json();
      setBlogs(data.blogs);
      setTotalBlogs(data.total); 
    } catch (err) {
      console.error("Error fetching blogs", err);
      toast.error("Error fetching blogs");
    }
  };

  const handleCommentSubmit = async (blogId) => {
    const commentText = commentData[blogId];
    if (!commentText) {
      toast.error("Please enter a comment");
      return;
    }

    setLoading((prev) => ({ ...prev, [blogId]: true }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/blog/${blogId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ commentText }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Comment added successfully");
        setCommentData((prevData) => ({
          ...prevData,
          [blogId]: "",
        }));
        fetchBlogs();
      } else {
        toast.error(result.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading((prev) => ({ ...prev, [blogId]: false }));
    }
  };

  const handleCommentChange = (blogId, event) => {
    setCommentData((prevData) => ({
      ...prevData,
      [blogId]: event.target.value,
    }));
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

  const handleToggleContent = (blogId) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === blogId
          ? { ...blog, showFullContent: !blog.showFullContent }
          : blog
      )
    );
  };

  return (
    <div>
      <NavBar />
      <div className="blog-page">
        <div className="blogs-container">
          {blogs.map((blog) => (
            <Card key={blog._id} className="blog-card">
              <CardContent>
                <div className="blog-header">
                  <Avatar
                    alt={blog.userId?.name || "Unknown Writer"}
                    src={blog.userId?.profileImage || "default-avatar.jpg"}
                    className="writer-avatar"
                  />
                  <div className="writer-info">
                    <Typography variant="h6">
                      {blog.userId?.name || "Unknown Writer"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {blog.userId?.email || "Unknown Email"}
                    </Typography>
                  </div>
                </div>
                <Typography variant="h5" className="blog-title">
                  {blog.title}
                </Typography>
                <Typography variant="body1" className="blog-category">
                  {blog.category}
                </Typography>
                <Typography variant="body1" className="blog-content">
                  {blog.showFullContent
                    ? blog.content
                    : `${blog.content.slice(0, truncateLength)}...`}
                </Typography>
                <Button
                  onClick={() => handleToggleContent(blog._id)}
                  variant="outlined"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent', 
                      color: 'primary.main',
                    },
                    marginTop: '16px', 
                  }}
                  
                >
                  {blog.showFullContent ? "Show Less" : "See More"}
                </Button>

                <div className="comments-section">
                  <Typography variant="h6" className="comments-title">
                    Comments
                  </Typography>
                  {blog.comments.length ? (
                    blog.comments.map((comment) => (
                      <div key={comment._id} className="comment-item">
                        <Avatar
                          alt={comment.userId?.name || "Anonymous"}
                          src={
                            comment.userId?.profileImage ||
                            "default-avatar.jpg"
                          }
                          className="comment-avatar"
                        />
                        <div className="comment-info">
                          <Typography
                            variant="body2"
                            className="commenter-name"
                          >
                            {comment.userId?.name || "Anonymous"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            className="comment-time"
                          >
                            {new Date(comment.createdAt).toLocaleString()}
                          </Typography>
                          <Typography variant="body1" className="comment-text">
                            {comment.commentText || "No Comment Provided"}
                          </Typography>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No comments yet.
                    </Typography>
                  )}

                  <FormControl className="comment-form">
                    <TextField
                      label="Add a Comment"
                      multiline
                      rows={4}
                      variant="outlined"
                      fullWidth
                      value={commentData[blog._id] || ""}
                      onChange={(e) => handleCommentChange(blog._id, e)}
                    />
                    <Button
                      onClick={() => handleCommentSubmit(blog._id)}
                      variant="contained"
                      color="primary"
                      disabled={loading[blog._id]}
                    >
                      {loading[blog._id] ? (
                        <CircularProgress size={24} color="white" />
                      ) : (
                        "Post Comment"
                      )}
                    </Button>
                  </FormControl>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="pagination-buttons">
          <Button
            onClick={handlePreviousPage}
            variant="outlined"
            disabled={currentPage === 1}
            sx={{
                '&:hover': {
                  backgroundColor: 'transparent', 
                  color: 'primary.main',
                },
              }}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            variant="outlined"
            disabled={currentPage * blogsPerPage >= totalBlogs}
            sx={{
                '&:hover': {
                  backgroundColor: 'transparent', 
                  color: 'primary.main',
                },
                marginTop: '16px',
              }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
