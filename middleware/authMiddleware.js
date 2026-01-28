const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Middleware to verify JWT token and authenticate Admin
 */
const protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Extract token from header (Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Find Admin and attach to request object object (excluding password)
            req.admin = await Admin.findById(decoded.id).select('-password');

            if (!req.admin) {
                res.status(401);
                throw new Error('Not authorized, admin not found');
            }

            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error.message);
            res.status(401).json({
                message: 'Not authorized, token failed',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // 5. If no token found
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };
