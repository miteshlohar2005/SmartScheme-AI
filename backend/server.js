const path = require('path');
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const schemeRoutes = require('./routes/schemeRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/schemes', schemeRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
    logger.log(`Backend server running on port ${PORT}`);
});
