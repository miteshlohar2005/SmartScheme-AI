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

const checkEligibility = async (req, res, next) => {
    try {
        const profile = req.body;
        const result = await schemeService.checkEligibility(profile);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const chatAssistant = async (req, res, next) => {
    try {
        const { message } = req.body;
        const result = await schemeService.chatAssistant(message);
        res.json({ text: result });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSchemes,
    checkEligibility,
    chatAssistant
};
