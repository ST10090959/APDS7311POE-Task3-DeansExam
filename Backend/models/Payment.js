// models/paymentModel.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // user ID who made the payment
    amount: { type: Number, required: true }, // amount to be paid
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentMethod: { type: String, required: true }, // Payment method, e.g., "Credit Card", "Debit Card"
    cardDetails: {
        cardNumber: { type: String, required: true }, // Full card number
        cardType: { type: String, required: true }, // e.g., "Visa", "MasterCard"
        expiryDate: { type: String, required: true }, // Expiry date of the card (MM/YY format)
    },
    transactionId: { type: String }, // Transaction ID for record keeping
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
