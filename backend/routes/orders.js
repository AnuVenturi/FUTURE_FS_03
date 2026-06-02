const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST - Create new order
router.post('/create', async (req, res) => {
    try {
        const { name, email, phone, items, description, deliveryDate } = req.body;
        
        // Validation
        if (!name || !email || !phone || !items || items.length === 0 || !deliveryDate) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill all required fields' 
            });
        }
        
        // Create new order
        const order = new Order({
            name,
            email,
            phone,
            items,
            description: description || '',
            deliveryDate
        });
        
        await order.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Order placed successfully!',
            orderId: order.orderId,
            order: order
        });
        
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again.' 
        });
    }
});

// GET - Get all orders (Admin)
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET - Get pending orders (Admin)
router.get('/pending', async (req, res) => {
    try {
        const orders = await Order.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET - Get delivered orders (Admin)
router.get('/delivered', async (req, res) => {
    try {
        const orders = await Order.find({ status: 'delivered' }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT - Update order status to delivered
router.put('/deliver/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        order.status = 'delivered';
        await order.save();
        
        res.json({ success: true, message: 'Order marked as delivered' });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST - Admin login
router.post('/admin-login', async (req, res) => {
    const { email, password } = req.body;
    
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

module.exports = router;