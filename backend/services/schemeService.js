const cacheService = require('../cache/cacheService');
const geminiProvider = require('../providers/geminiProvider');
const logger = require('../utils/logger');

const searchSchemes = async (query, category, state) => {
    let contextStr = [];
    if (category && category !== 'All') contextStr.push(`Category: ${category}`);
    if (state && state !== 'All') contextStr.push(`State: ${state}`);
    
    const fullSearchString = `Search query: "${query || ''}". ${contextStr.join(', ')}`;
    const cacheKey = fullSearchString.toLowerCase().trim();

    // 1. Check Cache
    const cachedSchemes = cacheService.get(cacheKey);
    if (cachedSchemes) {
        return cachedSchemes;
    }

    // 2. Fetch from Provider (Gemini)
    try {
        const schemes = await geminiProvider.fetchSchemesFromGemini(fullSearchString);
        
        // 3. Cache the results
        if (schemes && Array.isArray(schemes)) {
            cacheService.set(cacheKey, schemes);
        }
        
        return schemes;
    } catch (error) {
        logger.error("Error in schemeService:", error);
        throw error;
    }
};

const checkEligibility = async (profile) => {
    try {
        const result = await geminiProvider.evaluateEligibility(profile);
        return result;
    } catch (error) {
        logger.error("Error in checkEligibility:", error);
        throw error;
    }
};

const chatAssistant = async (message) => {
    try {
        const text = await geminiProvider.chatWithAssistant(message);
        return text;
    } catch (error) {
        logger.error("Error in chatAssistant:", error);
        throw error;
    }
};

module.exports = {
    searchSchemes,
    checkEligibility,
    chatAssistant
};
