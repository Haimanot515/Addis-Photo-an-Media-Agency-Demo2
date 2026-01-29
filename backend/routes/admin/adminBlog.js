const express = require("express");
const router = express.Router();
const multer = require("multer");

// Middleware
const adminMiddleware = require("../../middleware/adminMiddleware");

// Independent Controller Imports
const { getAllPosts } = require("../../controllers/admin/adminBlog");
const { createPost } = require("../../controllers/admin/adminBlog");
const { dropPost } = require("../../controllers/admin/adminBlog");
const { getPostBySlug } = require("../../controllers/admin/adminBlog");

// Setup Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

/* -----------------------------------------
    ADMIN BLOG AUTHORITY
----------------------------------------- */

// FETCH the registry
// Path: GET /api/admin/blog
router.get(
    "/", 
    adminMiddleware, 
    getAllPosts
);

// FETCH a specific node by slug (Optional, for admin preview)
// Path: GET /api/admin/blog/:slug
router.get(
    "/:slug", 
    adminMiddleware, 
    getPostBySlug
);

// PUSH a new node
// Path: POST /api/admin/blog
router.post(
    "/", 
    adminMiddleware, 
    upload.single("image"), 
    createPost
);

// DROP a node
// Path: DELETE /api/admin/blog/:id
router.delete(
    "/:id", 
    adminMiddleware, 
    dropPost
);

module.exports = router;