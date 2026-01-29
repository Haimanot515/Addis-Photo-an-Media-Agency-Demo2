const express = require("express");
const { getAllPortfolioItems } = require("../controllers/portfolio");

const router = express.Router();

// Public: View the gallery
router.get("/", getAllPortfolioItems);

module.exports = router;