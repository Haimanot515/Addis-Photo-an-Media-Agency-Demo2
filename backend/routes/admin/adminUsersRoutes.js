const express = require("express");
const router = express.Router();

// Middleware
const adminMiddleware = require("../../middleware/adminMiddleware");

// Independent Controller Imports
const { getUsers } = require("../../controllers/admin/adminUsers");
const { statusUser } = require("../../controllers/admin/adminUsers");
const { roleUser } = require("../../controllers/admin/adminUsers");
const { verifyUser } = require("../../controllers/admin/adminUsers");
const { dropUser } = require("../../controllers/admin/adminUsers");

/* -----------------------------------------
    ADMIN USER REGISTRY AUTHORITY
----------------------------------------- */

// FETCH the registry (All users + Every Information Stats)
// Path: GET /api/admin/users
router.get(
    "/", 
    adminMiddleware, 
    getUsers
);

// UPDATE status (Suspend / Activate)
// Path: PUT /api/admin/users/status/:id
router.put(
    "/status/:id", 
    adminMiddleware, 
    statusUser
);

// UPDATE role (Promote / Demote)
// Path: PUT /api/admin/users/role/:id
router.put(
    "/role/:id", 
    adminMiddleware, 
    roleUser
);

// MANUAL VERIFY (Force Active)
// Path: PUT /api/admin/users/verify/:id
router.put(
    "/verify/:id", 
    adminMiddleware, 
    verifyUser
);

// DROP a node (Permanent Removal)
// Path: DELETE /api/admin/users/:id
router.delete(
    "/:id", 
    adminMiddleware, 
    dropUser
);

module.exports = router;