/**
 * Password Entropy Tool - Main Server
 * Express.js application with modular routes
 */
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Production optimizations
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Static files serving
app.use(express.static('public', {
    maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
    etag: true
}));

// Main route - serve the application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// API Routes
app.use('/api/analyze', require('./routes/analyze'));
app.use('/api/generate', require('./routes/generate'));

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Password Entropy Tool running at http://localhost:${PORT}`);
});

module.exports = app;
