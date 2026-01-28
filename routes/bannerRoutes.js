const express = require('express');
const router = express.Router();

const { getAllBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getAllBanners);
router.post('/', protect, upload.single('image'), createBanner);
router.put('/:id', protect, upload.single('image'), updateBanner);
router.delete('/:id', protect, deleteBanner);

module.exports = router;
