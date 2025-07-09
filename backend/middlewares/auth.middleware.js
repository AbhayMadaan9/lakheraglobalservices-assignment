const jwt = require('jsonwebtoken');
const db = require('../models'); // adjust if needed
const { getUserRepo } = require('../repositories/userRepo');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or malformed' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await getUserRepo(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const { password, ...remainingUser } = user;
        req.user = remainingUser;
        next();
    } catch (err) {
        console.error('Auth error:', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
