const Banner = require('../models/Banner');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ active: true }).sort({ createdAt: -1 });
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
    try {
        const { title, link, active } = req.body;
        const image = req.file ? req.file.path : '';

        if (!image) {
            return res.status(400).json({ message: 'Banner image is required' });
        }

        const banner = await Banner.create({
            title,
            image,
            link,
            active: active === 'false' ? false : true
        });

        res.status(201).json(banner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        const { title, link, order, isActive } = req.body;

        // Update fields
        banner.title = title !== undefined ? title : banner.title;
        banner.link = link !== undefined ? link : banner.link;
        banner.order = order !== undefined ? order : banner.order;
        banner.isActive = isActive !== undefined ? isActive : banner.isActive;

        // Update image if new one is provided
        if (req.file) {
            banner.image = req.file.path;
        }

        const updatedBanner = await banner.save();
        res.status(200).json(updatedBanner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        await banner.deleteOne();
        res.status(200).json({ message: 'Banner removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner
};
