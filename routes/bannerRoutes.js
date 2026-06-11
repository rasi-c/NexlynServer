const express = require('express');
const router = express.Router();

const { getAllBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getAllBanners);

const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]);

// Wrap multer in a callback so Cloudinary/multer errors are returned as readable JSON
// instead of being swallowed by Express's global 500 handler
const handleUpload = (req, res, next) => {
    uploadFields(req, res, (err) => {
        if (err) {
            console.error('❌ Upload middleware error:', err.message, err);
            return res.status(400).json({
                message: `Upload failed: ${err.message}`,
                code: err.code || err.http_code || 'UPLOAD_ERROR'
            });
        }
        next();
    });
};

router.post('/', protect, handleUpload, createBanner);
router.put('/:id', protect, handleUpload, updateBanner);
router.delete('/:id', protect, deleteBanner);

module.exports = router;

