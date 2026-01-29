const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminMiddleware = require("../../middleware/adminMiddleware");
const { addFeaturedWork, dropFeaturedWork } = require("../../controllers/admin/featuredWorks");

// Setup Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

/* -----------------------------------------
   ADMIN FEATURES AUTHORITY
----------------------------------------- */

// PUSH a new feature
// Path: POST /api/admin/features
router.post(
    "/", 
    adminMiddleware, 
    upload.single("image"), 
    addFeaturedWork
);

// DROP a feature
// Path: DELETE /api/admin/features/:id
router.delete(
    "/:id", 
    adminMiddleware, 
    dropFeaturedWork
);

module.exports = router;