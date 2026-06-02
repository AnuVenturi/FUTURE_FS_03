const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    items: [{
        type: String
    }],
    description: {
        type: String,
        default: ''
    },
    deliveryDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'delivered'],
        default: 'pending'
    },
    orderDate: {
        type: String,
        default: function() {
            return new Date().toLocaleString();
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Generate order ID before saving
OrderSchema.pre('save', async function(next) {
    if (!this.orderId) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderId = `SVS${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Order', OrderSchema);