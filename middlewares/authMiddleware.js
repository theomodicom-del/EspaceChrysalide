const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Accès refusé. Aucun jeton fourni.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Jeton invalide ou expiré.' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
    }

    next();
};