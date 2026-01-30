const express = require("express");
const router = express.Router();
const multer = require("multer");

// Middleware
const adminMiddleware = require("../../middleware/adminMiddleware");

// Independent Controller Imports
const { getAdminProfile } = require("../../controllers/admin/adminProfile");
const { pushAdminProfile } = require("../../controllers/admin/adminProfile");

// Setup Multer for memory storage (Required for Supabase PUSH)
const upload = multer({ storage: multer.memoryStorage() });

/* -----------------------------------------
    ADMIN IDENTITY AUTHORITY
----------------------------------------- */

// FETCH the identity node
// Path: GET /api/admin/profile
router.get(
    "/", 
    adminMiddleware, 
    getAdminProfile
);

// PUSH identity updates
// Path: POST /api/admin/profile
// Note: Uses "photo" as the field name for the profile image
router.post(
    "/", 
    adminMiddleware, 
    upload.single("photo"), 
    pushAdminProfile
);

module.exports = router;