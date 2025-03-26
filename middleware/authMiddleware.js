const jwt = require("jsonwebtoken");
const {UserModel} = require('../models/usermodel');
const JWT_SECRET = process.env.JWT_SECRET_KEY || "fallbacksecret";

const authMiddleware = async ( req, res, next) => {
    try {
        // get token
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: "No token provided"});
        }

        // verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // find user and attach to request
        const user = await UserModel.findById(decoded.userId).select('-password');
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //  Attach user to request object
        req.user = user;
        req.token = token;
        next();

    }   catch (error) {
        console.error('Authentication error:', error.message);
          // Specific error responses
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please login again.',
                error: error.message
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Not authorized',
            error: error.message || 'Invalid token'
        });
      }
};

module.exports = authMiddleware;