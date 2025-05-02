const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ error: "Access denied. No token provided" });
    };

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        const user = await User.findById(decoded.id); // Fetch user from DB
        if (!user) {
            return res.status(401).json({ error: "Access denied. User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Access denied. Invalid token" });
    }       
};

// middleware/optionalAuth.js


const optionalAuthMiddleware = (req, res, next) => {
    const authHeader = req.header(`Authorization`);
    // const authHeader = req.headers.authorization;

    // If no token, proceed as guest
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    // Extract and verify token
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = User.findById(decoded.id); // Fetch user from DB
        if (user) {
            req.user = user; // Attach user to request object
            console.log("User found:", user);  
        }
        next();
    } catch (err) {
        // Invalid token - still proceed as guest (or return 401 if you prefer)
        console.warn('Invalid token - proceeding as guest');
        next();
    }
};





// Role based authentication
const roleMiddleware = (roles) => (req, res, next) => {
    console.log("User role:", req.user.role);
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};


module.exports = {
    authMiddleware,
    optionalAuthMiddleware,
    roleMiddleware
};