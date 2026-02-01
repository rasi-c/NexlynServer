const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100; // Large default to keep compatibility
        const skip = (page - 1) * limit;

        const products = await Product.find({})
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments();

        // Add caching headers for public data (1 hour)
        // res.set('Cache-Control', 'public, max-age=3600');

        res.status(200).json({
            products,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get products by category
// @route   GET /api/products/category/:id
// @access  Public
const getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.id }).populate('category', 'name slug');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, keyFeatures, specifications, inStock } = req.body;

        // Extract image URLs from req.files (uploaded via Cloudinary storage)
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        // Parse keyFeatures and specifications if they are strings (JSON)
        let parsedKeyFeatures = keyFeatures;
        let parsedSpecifications = specifications;

        if (typeof keyFeatures === 'string') {
            try { parsedKeyFeatures = JSON.parse(keyFeatures); } catch (e) { parsedKeyFeatures = []; }
        }
        if (typeof specifications === 'string') {
            try { parsedSpecifications = JSON.parse(specifications); } catch (e) { parsedSpecifications = []; }
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            images: imageUrls,
            keyFeatures: parsedKeyFeatures,
            specifications: parsedSpecifications,
            inStock: inStock === 'false' ? false : true
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { name, description, price, category, keyFeatures, specifications, inStock } = req.body;

        // If new images are uploaded, add them to existing ones or replace them
        // For this implementation, we will append new images if provided
        if (req.files && req.files.length > 0) {
            const newImageUrls = req.files.map(file => file.path);
            product.images = [...product.images, ...newImageUrls];
        }

        // Parse keyFeatures and specifications if they are strings
        if (keyFeatures) {
            product.keyFeatures = typeof keyFeatures === 'string' ? JSON.parse(keyFeatures) : keyFeatures;
        }
        if (specifications) {
            product.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.inStock = inStock !== undefined ? inStock : product.inStock;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete images from Cloudinary (optional but recommended)
        // Note: For full cleanup, you'd extract the public_id from the URL and call cloudinary.uploader.destroy

        await product.deleteOne();
        res.status(200).json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductsByCategory,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
