const express = require("express");
const router = express.Router();

// Import the Authority Controllers
const { 
  getAllMessages, 
  replyToMessage, 
  dropMessage,
  markMessagesRead 
} = require("../../controllers/admin/adminContact");

// Import Admin Authority Middleware
const adminMiddleware = require("../../middleware/adminMiddleware");

/**
 * @route   GET /api/admin/messages
 * @desc    Syncs the Admin Dashboard with the database registry
 * @access  Private (Admin Only)
 */
router.get("/", adminMiddleware, getAllMessages);

/**
 * @route   POST /api/admin/messages/reply
 * @desc    Transmits the formal response via the Email Authority Bridge
 * @access  Private (Admin Only)
 */
router.post("/reply", adminMiddleware, replyToMessage);

/**
 * @route   POST /api/admin/messages/mark-read
 * @desc    Updates the persistence state to clear unread badges (Fixes refresh issue)
 * @access  Private (Admin Only)
 */
router.post("/mark-read", adminMiddleware, markMessagesRead);

/**
 * @route   DELETE /api/admin/messages/:id
 * @desc    Executes the DROP command to remove resolved records permanently
 * @access  Private (Admin Only)
 */
router.delete("/:id", adminMiddleware, dropMessage);

module.exports = router;