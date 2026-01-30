const express = require("express");
const router = express.Router(); // <--- THIS MUST BE HERE
const multer = require("multer");

// Middleware
const authMiddleware = require("../middleware/authMiddleware"); 

// Independent Controller Imports
const { getUserProfile, updateUserProfile } = require("../controllers/userProfile");

// Setup Multer
const upload = multer({ storage: multer.memoryStorage() });

/* -----------------------------------------
    USER IDENTITY AUTHORITY
----------------------------------------- */

// FETCH current user's identity
router.get("/profile", authMiddleware, getUserProfile);

// PUSH identity updates
router.post("/profile", authMiddleware, upload.single("photo"), updateUserProfile);

module.exports = router;