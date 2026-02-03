const express = require('express');
const router = express.Router();

const { getAllBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getAllBanners);

const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 }
]);

router.post('/', protect, uploadFields, createBanner);
router.put('/:id', protect, uploadFields, updateBanner);
router.delete('/:id', protect, deleteBanner);

module.exports = router;
