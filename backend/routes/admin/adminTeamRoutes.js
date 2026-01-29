const express = require("express");
const router = express.Router();
const multer = require("multer");

// Controllers
const { addTeamMember, deleteTeamMember } = require("../../controllers/admin/adminTeam");
const { getAllTeamMembers } = require("../../controllers/team"); // Using your existing user controller for the GET

// Middleware
const adminMiddleware = require("../../middleware/adminMiddleware");

// Multer setup for memory storage (required for Supabase PUSH)
const upload = multer({ storage: multer.memoryStorage() });

/* ───── TEAM REGISTRY ROUTES ───── */

/**
 * @route   GET /api/admin/team
 * @desc    Fetch all team members for the admin dashboard
 * @access  Private (Admin)
 */
router.get("/", adminMiddleware, getAllTeamMembers);

/**
 * @route   POST /api/admin/team
 * @desc    PUSH a new team member to the registry
 * @access  Private (Admin)
 */
router.post("/", adminMiddleware, upload.single("image"), addTeamMember);

/**
 * @route   DELETE /api/admin/team/:id
 * @desc    DROP a team member from the registry
 * @access  Private (Admin)
 */
router.delete("/:id", adminMiddleware, deleteTeamMember);

module.exports = router;