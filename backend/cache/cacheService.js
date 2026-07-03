const NodeCache = require('node-cache');
const logger = require('../utils/logger');

// 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

const get = (key) => {
    const value = cache.get(key);
    if (value) {
        logger.log(`Cache HIT for key: ${key}`);
    } else {
        logger.log(`Cache MISS for key: ${key}`);
    }
    return value;
};

const set = (key, value) => {
    logger.log(`Cache SET for key: ${key}`);
    cache.set(key, value);
};

module.exports = { get, set };
