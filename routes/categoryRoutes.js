const express = require('express');
const router = express.Router();
const { createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory } = require('../controllers/categorController');

const {
    authMiddleware,
    roleMiddleware,
} = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, roleMiddleware(['admin']), createCategory);
router.get('/', authMiddleware, roleMiddleware(['admin']), getCategories); 
router.get('/:id', authMiddleware, roleMiddleware(['admin']), getCategoryById);

router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateCategory);

router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteCategory);

module.exports = router;