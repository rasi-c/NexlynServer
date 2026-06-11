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
// NOTE: params must be an async function in multer-storage-cloudinary v4
// to correctly set resource_type per file (videos need 'video', not 'image')
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith('video/');
        return {
            folder: 'ecommerce',
            resource_type: isVideo ? 'video' : 'image',
        };
    }
});

// Create Multer upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit for videos
    },
    fileFilter: (req, file, cb) => {
        // Log the file for debugging if needed (will show in server console)
        console.log('Uploading file:', file.originalname, 'Mime:', file.mimetype);

        const allowedTypes = /image\/(jpeg|jpg|png|webp)|video\/(mp4|quicktime|webm|x-matroska|mpeg|ogg)/;
        const isMimeValid = allowedTypes.test(file.mimetype);

        if (isMimeValid) {
            cb(null, true);
        } else {
            cb(new Error(`File type "${file.mimetype}" is not supported. Use JPG, PNG, WEBP for images and MP4, MOV, WEBM for videos.`), false);
        }
    }
});

module.exports = {
    cloudinary,
    upload
};
