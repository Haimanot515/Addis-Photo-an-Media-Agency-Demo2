const express = require("express");
const router = express.Router();
const adminMiddleware = require("../../middleware/adminMiddleware");

// ✅ INDEPENDENT IMPORTS (The Authority Pattern)
const { 
    getAdminLegalRegistry,
    pushPrivacyRule, dropPrivacyRule,
    pushTermsRule, dropTermsRule,
    pushCookieRule, dropCookieRule 
} = require("../../controllers/admin/adminLegal");

/* -----------------------------------------
    ADMIN LEGAL AUTHORITY: REGISTRY SYNC
----------------------------------------- */

// Fetch all rules for all policies (1, 2, 3...)
router.get("/", adminMiddleware, getAdminLegalRegistry);

/* -----------------------------------------
    ADMIN LEGAL AUTHORITY: PRIVACY
----------------------------------------- */

// Commit PUSH (Add new or Update specific by ID in body)
router.put("/privacy", adminMiddleware, pushPrivacyRule);

// Execute DROP (Remove specific node by ID)
router.delete("/privacy/:id", adminMiddleware, dropPrivacyRule);

/* -----------------------------------------
    ADMIN LEGAL AUTHORITY: TERMS
----------------------------------------- */

// Commit PUSH (Add new or Update specific by ID in body)
router.put("/terms", adminMiddleware, pushTermsRule);

// Execute DROP (Remove specific node by ID)
router.delete("/terms/:id", adminMiddleware, dropTermsRule);

/* -----------------------------------------
    ADMIN LEGAL AUTHORITY: COOKIES
----------------------------------------- */

// Commit PUSH (Add new or Update specific by ID in body)
router.put("/cookie", adminMiddleware, pushCookieRule);

// Execute DROP (Remove specific node by ID)
router.delete("/cookie/:id", adminMiddleware, dropCookieRule);

module.exports = router;