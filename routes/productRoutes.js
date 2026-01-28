const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductsByCategory,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Public Routes
router.get('/', getAllProducts);
router.get('/category/:id', getProductsByCategory);
router.get('/:id', getProductById);

// Protected Admin Routes
// upload.array('images', 10) allows up to 10 image files to be uploaded to Cloudinary
router.post('/', protect, upload.array('images', 10), createProduct);
router.put('/:id', protect, upload.array('images', 10), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
