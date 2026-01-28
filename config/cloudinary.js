const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ecommerce',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        // transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Optional: limit size
    }
});

// Create Multer upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const isMimeValid = allowedTypes.test(file.mimetype);

        if (isMimeValid) {
            cb(null, true);
        } else {
            cb(new Error('Only images (JPG, JPEG, PNG, WEBP) are allowed'), false);
        }
    }
});

module.exports = {
    cloudinary,
    upload
};
