const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminMiddleware = require("../../middleware/adminMiddleware");

// Independent Imports
const { getHeroData } = require("../../controllers/admin/adminHero");
const { updateHeroData } = require("../../controllers/admin/adminHero");

const upload = multer({ storage: multer.memoryStorage() });

/* -----------------------------------------
    ADMIN HERO AUTHORITY
----------------------------------------- */

router.get("/", adminMiddleware, getHeroData);
router.post("/", adminMiddleware, upload.single("image"), updateHeroData);

module.exports = router;