const express = require('express');
const router = express.Router();

const { registerUser } = require('../../controllers/authentication/registerUser');
const { loginUser } = require('../../controllers/authentication/loginUser');
const { verifyUser } = require('../../controllers/authentication/verifyUser');

// ✅ FIXED: Routes now match the exact strings used in your Frontend Axios calls
router.post('/register', registerUser);      // URL: /api/auth/register
router.post('/login-user', loginUser);       // URL: /api/auth/login-user
router.post('/verify-user', verifyUser);     // URL: /api/auth/verify-user

module.exports = router;