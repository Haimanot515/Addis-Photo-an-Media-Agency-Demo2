
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); 
const { contact } = require("../controllers/contact");

const router = express.Router();

// This "/" handles the POST to /api/contact
router.post("/", authMiddleware, contact);

module.exports = router;