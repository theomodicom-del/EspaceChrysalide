const rateLimit = require('express-rate-limit');

exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Trop de requêtes, veuillez réessayer plus tard." },
    standardHeaders: true,
    legacyHeaders: false,
});

exports.authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { message: "Trop de tentatives, veuillez réessayer dans une heure." },
    standardHeaders: true,
    legacyHeaders: false,
});