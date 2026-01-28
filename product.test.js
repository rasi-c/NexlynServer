const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');

// Mock a minimal version of the app for testing routes
const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

// Mock the Protect middleware to skip auth for tests
jest.mock('./middleware/authMiddleware', () => ({
    protect: (req, res, next) => next(),
}));

describe('Product API Endpoints', () => {
    it('GET /api/products should return 200', async () => {
        // We need to mock the Mongoose Find to avoid connecting to a real DB during unit tests
        const Product = require('./models/Product');
        jest.spyOn(Product, 'find').mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([{ name: 'Mock Product' }]),
        });
        jest.spyOn(Product, 'countDocuments').mockResolvedValue(1);

        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body.products).toHaveLength(1);
        expect(res.body.products[0].name).toBe('Mock Product');
    });
});
