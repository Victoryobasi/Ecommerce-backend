const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, } = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/proceed/order', authMiddleware, createOrder); // Create a new order
router.get('/all/order', authMiddleware, getAllOrders); // Get all orders for a user 
router.get('/user/order/:id', authMiddleware, getOrderById); // Get a single order by ID

module.exports = router;