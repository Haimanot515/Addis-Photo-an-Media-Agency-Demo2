const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); 
const { getAllTeamMembers} = require("../controllers/team");

const router = express.Router();

// Public: View the team
router.get("/", getAllTeamMembers);



module.exports = router;