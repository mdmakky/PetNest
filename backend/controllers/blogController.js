const Blog = require("../models/Blog");
const User = require("../models/User");

exports.addBlog = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Please login first" });
    }
    const userId = req.user.id;

    const { title, category, content } = req.body;

    const newBlog = new Blog({
      title,
      category,
      content,
      userId,
    });

    await newBlog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (err) {
    console.error("Error while adding blog:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

exports.getBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 6; 
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find({accept: true})
      .populate("userId", "name email profileImage")
      .populate("comments.userId", "name email profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs =  await Blog.countDocuments({ accept: true });

    res.json({
      blogs,
      total: totalBlogs, 
    });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { commentText } = req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Please login first." });
    }

    const userId = req.user.id;

    if (!commentText) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const blog = await Blog.findById(blogId).populate(
      "comments.userId",
      "name email profileImage"
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.comments.push({ userId, commentText });
    await blog.save();

    return res
      .status(200)
      .json({ message: "Comment added successfully", blog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.myBlogs = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Please log in first." });
    }
    
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ userId, accept: true })
      .populate('userId', 'name profileImage')
      .populate('comments.userId', 'name email profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ userId, accept: true });
    
    res.json({ 
      success: true,
      blogs,
      total
    });
  } catch (error) {
    console.error("Error fetching my blogs:", error);  
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
