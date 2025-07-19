const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
    console.error('FATAL ERROR: JWT_SECRET_KEY is not defined in .env. Exiting process.');
    process.exit(1);
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ message: 'Authentication token required. Please log in.' });
    }


    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err.message);
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Token expired. Please log in again.' });
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ message: 'Invalid token. Access denied.' });
            }
            return res.status(403).json({ message: 'Forbidden: Invalid token.' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
