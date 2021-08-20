const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).json({Error: 'Access Denied'});

    try {
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY_JWT_AGENT);
        req.user = verifyToken.user;
        next();
    } catch (error) {
        let message;
        if(!req.user) message = 'Session Timed-Out! User Not Found';
        else message = error;
        res.status(500).json({Error: message});
    }

};