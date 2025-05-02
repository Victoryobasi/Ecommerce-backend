const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logoutUser, } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware')

// Register a new user
router.post('/register', registerUser);

// Login an existing user
router.post('/login', loginUser);

// Logout an existing user
// router.get('/logout', authMiddleware, logoutUser);


module.exports = router;
