const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();  // Ensure environment variables are loaded

const router = express.Router();
const uri = process.env.MONGO_URI; // Ensure MONGO_URI is in your .env file

// Create a MongoDB client
const client = new MongoClient(uri);

// Route for creating payment (simulated)
router.post('/payment', [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required'),
    body('cardNumber').isLength({ min: 13, max: 19 }).withMessage('Card number must be between 13 and 19 digits'),
    body('cardType').notEmpty().withMessage('Card type is required'),
    body('expiryDate').notEmpty().withMessage('Expiry date is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, amount, paymentMethod, cardNumber, cardType, expiryDate } = req.body;

    try {
        await client.connect();
        const db = client.db('APDS7311'); // Replace with your database name
        const paymentCollection = db.collection('payments');  // Collection for payments

        // Simulate payment processing
        let paymentStatus = 'completed'; // Default success
        let transactionId = 'TXN' + Date.now(); // Fake transaction ID

        if (Math.random() < 0.2) {  // 20% chance of failure
            paymentStatus = 'failed';
            transactionId = 'TXN' + Date.now() + 'FAIL';
        }

        // Create payment object
        const payment = {
            userId,
            amount,
            paymentStatus,
            paymentMethod,
            cardDetails: { cardNumber, cardType, expiryDate },
            transactionId,
            queried: false, // New field for tracking queries
            createdAt: new Date()
        };

        // Insert the payment record into the database
        await paymentCollection.insertOne(payment);

        if (paymentStatus === 'completed') {
            res.status(200).json({ msg: 'Payment successful', transactionId });
        } else {
            res.status(400).json({ msg: 'Payment failed', transactionId });
        }

    } catch (err) {
        console.error('Error processing payment:', err.message);
        res.status(500).json({ msg: 'Error processing payment', error: err.message });
    } finally {
        await client.close();
    }
});

// Fetch payments by userId
router.get('/payments/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        await client.connect();
        const db = client.db('APDS7311'); // Your database name
        const paymentCollection = db.collection('payments');

        const payments = await paymentCollection.find({ userId }).sort({ createdAt: -1 }).toArray(); // Fetch sorted payments

        if (!payments || payments.length === 0) {
            return res.status(404).json({ msg: 'No payments found for this user' });
        }

        res.status(200).json(payments);

    } catch (err) {
        console.error('Error fetching payments:', err.message);
        res.status(500).json({ msg: 'Error fetching payments', error: err.message });
    } finally {
        await client.close();
    }
});

// Fetch all payments (for employee dashboard)
router.get('/payments', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('APDS7311'); // Your database name
        const paymentCollection = db.collection('payments');

        const payments = await paymentCollection.find().sort({ createdAt: -1 }).toArray(); // Fetch sorted payments

        if (!payments || payments.length === 0) {
            return res.status(404).json({ msg: 'No payments found' });
        }

        res.status(200).json(payments);

    } catch (err) {
        console.error('Error fetching payments:', err.message);
        res.status(500).json({ msg: 'Error fetching payments', error: err.message });
    } finally {
        await client.close();
    }
});

// ✅ NEW: Mark a payment as "queried" using transaction ID
router.post('/query', [
    body('transactionId').notEmpty().withMessage('Transaction ID is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { transactionId } = req.body;

    try {
        await client.connect();
        const db = client.db('APDS7311');
        const paymentCollection = db.collection('payments');

        // Check if the payment exists
        const payment = await paymentCollection.findOne({ transactionId });
        if (!payment) {
            return res.status(404).json({ msg: 'Payment not found' });
        }

        // Prevent duplicate queries
        if (payment.queried) {
            return res.status(400).json({ msg: 'Payment has already been queried' });
        }

        // Update the payment record to mark it as queried
        await paymentCollection.updateOne(
            { transactionId },
            { $set: { queried: true } }
        );

        res.status(200).json({ msg: 'Payment successfully queried' });

    } catch (err) {
        console.error('Error querying payment:', err.message);
        res.status(500).json({ msg: 'Error querying payment', error: err.message });
    } finally {
        await client.close();
    }
});

module.exports = router;
