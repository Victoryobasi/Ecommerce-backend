const express = require('express');
const router = express.Router();

const { addToCart, decrementProductQuantity,
    removeProductFromCart, getUserCart, getGuestCart,
        removeProductFromGuestCart } = require('../controllers/cartController');
const { authMiddleware, optionalAuthMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.post('/add-to-cart', optionalAuthMiddleware, addToCart)
router.get('/user-cart', optionalAuthMiddleware, getUserCart)
router.post('/decrement-product-quantity', authMiddleware, decrementProductQuantity)
router.delete('/remove/:productId', optionalAuthMiddleware, removeProductFromCart)


// for guest users route
router.get('/guest-cart', optionalAuthMiddleware, getGuestCart)
router.delete('/guest/:productId', optionalAuthMiddleware, removeProductFromGuestCart)





module.exports = router;

