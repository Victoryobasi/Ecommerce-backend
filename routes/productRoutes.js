const express = require('express');
const router = express.Router();

const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddlewares')

// Create a new product

router.post('/create', authMiddleware, upload.array("images", 7), roleMiddleware(['admin']), createProduct,);

// Get all products
router.get('/', authMiddleware, getProducts);

// Get a single product by ID
router.get('/:id', authMiddleware, getProductById);

// Update a product by ID

router.put('/:id', authMiddleware, upload.array("images", 7), updateProduct);

// Delete a product by ID
router.delete('/:id', authMiddleware, deleteProduct);


module.exports = router;
