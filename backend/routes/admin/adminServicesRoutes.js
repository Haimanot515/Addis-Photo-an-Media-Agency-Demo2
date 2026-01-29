const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminMiddleware = require("../../middleware/adminMiddleware");

// ✅ INDEPENDENT IMPORTS (The Authority Pattern)
const { getAdminServices } = require("../../controllers/admin/adminServices");
const { pushService } = require("../../controllers/admin/adminServices");
const { dropService } = require("../../controllers/admin/adminServices");

const upload = multer({ storage: multer.memoryStorage() });

/* -----------------------------------------
    ADMIN SERVICES AUTHORITY
----------------------------------------- */

// Fetch Registry
router.get("/", adminMiddleware, getAdminServices);

// Commit PUSH (with Multer for Image Node)
router.post("/", adminMiddleware, upload.single("image"), pushService);

// Execute DROP
router.delete("/:id", adminMiddleware, dropService);

module.exports = router;