const schemeService = require('../services/schemeService');
const logger = require('../utils/logger');

const getSchemes = async (req, res, next) => {
    try {
        const { query, category, state } = req.query;
        
        // Basic request validation could go here or in a middleware
        
        const schemes = await schemeService.searchSchemes(query, category, state);
        
        res.json({ schemes: schemes || [] });
    } catch (error) {
        // Pass to global error handler
        next(error);
    }
};

module.exports = {
    getSchemes
};
