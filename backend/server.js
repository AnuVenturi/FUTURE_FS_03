const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orders');

const app = express();

// CORS Middleware - FIXED (only once, with proper config)
app.use(cors({
    origin: '*',  // Allow all origins for Render/Vercel deployment
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected Successfully!'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// ========== IMPORTANT: Routes - THIS WAS MISSING ==========
// This line connects your API routes - WITHOUT THIS, you get 404 errors!
app.use('/api/orders', orderRoutes);
// ===========================================================

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'SVS Boutique API is running!' });
});

// Test API route (to verify routing is working)
app.get('/api/test', (req, res) => {
    res.json({ message: 'API test route is working!' });
});

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
});