// routes/blogRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); 
const { getAllPosts, getPostBySlug, createPost } = require("../controllers/blog");

const router = express.Router();

// Public: Get all posts for the blog list
router.get("/", getAllPosts);

// Public: Get a single article by its slug
router.get("/:slug", getPostBySlug);

// Protected: Create a new post (Requires login)
router.post("/", authMiddleware, createPost);

module.exports = router;