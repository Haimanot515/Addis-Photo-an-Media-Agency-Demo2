const express = require("express");
const router = express.Router();
const { getAllServices } = require("../controllers/services");

/**
 * @route   GET /api/services
 * @desc    Get all photography and videography services
 * @access  Public
 */
router.get("/", getAllServices);

module.exports = router;