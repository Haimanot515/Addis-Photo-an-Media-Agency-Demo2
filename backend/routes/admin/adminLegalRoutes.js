const express = require("express");
const router = express.Router();
const adminMiddleware = require("../../middleware/adminMiddleware"); // Matches Service Route

// ✅ INDEPENDENT IMPORTS (The Authority Pattern)
const { 
  getAdminLegalRegistry, 
  pushPrivacyRule, 
  dropPrivacyRule,
  pushTermsRule, 
  dropTermsRule,
  pushCookieRule, 
  dropCookieRule 
} = require("../../controllers/admin/adminLegal");

/* -----------------------------------------
    ADMIN LEGAL AUTHORITY
----------------------------------------- */

// SYNC: Fetch Entire Registry
router.get("/", adminMiddleware, getAdminLegalRegistry);

// PRIVACY: PUSH & DROP
router.put("/privacy", adminMiddleware, pushPrivacyRule);
router.delete("/privacy/:id", adminMiddleware, dropPrivacyRule);

// TERMS: PUSH & DROP
router.put("/terms", adminMiddleware, pushTermsRule);
router.delete("/terms/:id", adminMiddleware, dropTermsRule);

// COOKIE: PUSH & DROP
router.put("/cookie", adminMiddleware, pushCookieRule);
router.delete("/cookie/:id", adminMiddleware, dropCookieRule);

module.exports = router;