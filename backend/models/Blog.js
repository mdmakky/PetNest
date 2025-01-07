const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentText: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Pet Care', 'Pet Nutrition', 'Training and Behavior', 'Pet Health & Wellness',
        'Pet Accessories & Gear', 'Adoption & Rescue', 'Pet Stories & Experiences', 
        'Pet Events & Activities', 'Breed Information', 'Pet Safety', 'Pet Products',
        'Technology', 'Lifestyle', 'Travel', 'Food'
      ],
      default: 'Pet Care',
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
