const jwt = require('jsonwebtoken');

const verifyAuth = (req, res, next) => {
    const token = req.headers.authorization;

    console.log("Received Token", token);

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Token not processed' });
    }

    try {
        const decoded = jwt.verify(token.substring(7), 'Q$r2K6W8n!jCW%Zk'); // Remove 'Bearer ' prefix
        req.userId = decoded.userId;
        req.userName = decoded.userName;  // Added userName
        req.userRole = decoded.userRole;

        console.log("Decoded Token:", decoded);

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Unauthorized token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.userRole === "Admin") {
        next(); // User has the "Admin" role, proceed to the next middleware or route handler
    } else {
        return res.status(403).json({ message: 'Forbidden: Only admin can perform this action' });
    }
};

module.exports = { verifyAuth, isAdmin };
