const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");

/**
 * @route   GET /api/home/features
 * @desc    Fetch all featured gallery images
 */
router.get("/features", homeController.getFeaturedWorks);

/**
 * @route   GET /api/home/hero
 * @desc    Fetch hero image, titles, and marquee text
 */
router.get("/hero", homeController.getHeroData);

/**
 * @route   POST /api/home/subscribe
 * @desc    Add new email to the subscriber list
 */
router.post("/subscribe", homeController.subscribeUser);

module.exports = router;