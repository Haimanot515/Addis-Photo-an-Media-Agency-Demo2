const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); 
const { 
  getPrivacyPolicy, 
  getTermsOfService, 
  getCookiePolicy 
} = require("../controllers/legal");

const router = express.Router();

// Protected GET routes for legal content
router.get("/privacy-policy", authMiddleware, getPrivacyPolicy);
router.get("/terms-of-service", authMiddleware, getTermsOfService);
router.get("/cookie-policy", authMiddleware, getCookiePolicy);

module.exports = router;