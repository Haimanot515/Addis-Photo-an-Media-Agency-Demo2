const express = require("express");
const router = express.Router();
const { getAboutInfo } = require("../controllers/about");

router.get("/", getAboutInfo);

module.exports = router;