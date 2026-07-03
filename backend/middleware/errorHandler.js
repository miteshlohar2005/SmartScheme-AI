const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error('Unhandled Error:', err.message, err.stack);
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
        schemes: []
    });
};

module.exports = errorHandler;
