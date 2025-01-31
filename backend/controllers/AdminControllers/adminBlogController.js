const Blog = require("../../models/Blog");

exports.getBlogs = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  try {
    const blogs = await Blog.find({ accept: false })
      .populate("userId", "name email address")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const total = await Blog.countDocuments({ accept: false });

    res.json({
      blogs,
      total,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveBlog = async (req, res) => {
    try {
      const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { accept: true },
        { new: true }
      );
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      res.status(200).json({ message: "Blog approved successfully", blog });
    } catch (error) {
      console.error("Error approving blog:", error);
      res.status(500).json({ message: "Server error" });
    }
};

exports.declineBlog = async (req, res) => {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      res.status(200).json({ message: "Blog declined successfully" });
    } catch (error) {
      console.error("Error declining blog:", error);
      res.status(500).json({ message: "Server error" });
    }
};
  