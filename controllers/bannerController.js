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
        const { title, link, active, order } = req.body;

        const files = req.files || {};
        const image = files['image'] ? files['image'][0].path : '';
        const backgroundImage = files['backgroundImage'] ? files['backgroundImage'][0].path : '';

        if (!image) {
            return res.status(400).json({ message: 'Banner image is required' });
        }

        const banner = await Banner.create({
            title,
            image,
            backgroundImage,
            link,
            order: order ? parseInt(order) : 0,
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

        const { title, link, order, active } = req.body;

        // Update fields
        if (title !== undefined) banner.title = title;
        if (link !== undefined) banner.link = link;
        if (order !== undefined) banner.order = parseInt(order);
        if (active !== undefined) {
            banner.active = active === 'true' || active === true;
        }

        // Update images if provided
        const files = req.files || {};
        if (files['image']) {
            banner.image = files['image'][0].path;
        }
        if (files['backgroundImage']) {
            banner.backgroundImage = files['backgroundImage'][0].path;
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
