const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    detailedDescription: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        default: 0
    },
    images: {
        type: [String], // Array of Cloudinary URLs
        required: true
    },
    keyFeatures: {
        type: [String],
        default: []
    },
    specifications: {
        type: String,
        default: ''
    },
    useCases: {
        type: String,
        default: ''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product must belong to a category']
    },
    inStock: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
