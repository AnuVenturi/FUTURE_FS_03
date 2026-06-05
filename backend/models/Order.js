const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    items: [{ type: String }],
    description: { type: String, default: '' },
    deliveryDate: { type: String, required: true },
    status: { type: String, enum: ['pending', 'delivered'], default: 'pending' },
    orderDate: { type: String, default: () => new Date().toLocaleString() }
}, { timestamps: true });

// Generate a simple unique orderId before saving
OrderSchema.pre('save', async function(next) {
    if (!this.orderId) {
        // A simpler, more reliable way to generate an ID
        const date = new Date();
        const random = Math.floor(Math.random() * 10000);
        this.orderId = `SVS${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${random}`;
    }
    next();
});

module.exports = mongoose.model('Order', OrderSchema);