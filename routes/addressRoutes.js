const express = require('express');
const router = express.Router();
const { createAddress, getAllAddresses, updateAddress, deleteAddress } = require('../controllers/addressController');
const { authMiddleware } = require('../middlewares/authMiddleware')




router.post('/create', authMiddleware, createAddress);
router.get('/user/address', authMiddleware, getAllAddresses);
router.put('/update/user/address/:id', authMiddleware, updateAddress);
router.delete('/delete/user/address/:id', authMiddleware, deleteAddress);

module.exports = router;