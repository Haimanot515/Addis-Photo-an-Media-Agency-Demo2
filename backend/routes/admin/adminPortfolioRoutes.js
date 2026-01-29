
const express = require("express");
const router = express.Router();
const multer = require("multer");

// Middleware
const adminMiddleware = require("../../middleware/adminMiddleware");

// Independent Controller Imports
const { addPortfolioItem } = require("../../controllers/admin/adminPortfolio");
const { dropPortfolioItem } = require("../../controllers/admin/adminPortfolio");
const { getAllPortfolioItems } = require("../../controllers/admin/adminPortfolio");

// Setup Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

/* -----------------------------------------
    ADMIN PORTFOLIO AUTHORITY
----------------------------------------- */

// FETCH the registry
// Path: GET /api/admin/portfolio
router.get(
    "/", 
    adminMiddleware, 
    getAllPortfolioItems
);

// PUSH a new node
// Path: POST /api/admin/portfolio
router.post(
    "/", 
    adminMiddleware, 
    upload.single("image"), 
    addPortfolioItem
);

// DROP a node
// Path: DELETE /api/admin/portfolio/:id
router.delete(
    "/:id", 
    adminMiddleware, 
    dropPortfolioItem
);

module.exports = router;