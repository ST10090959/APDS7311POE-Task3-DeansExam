const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI; // Your MongoDB URI

const router = express.Router();
const client = new MongoClient(uri);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'unisafeapp7319@gmail.com',
        pass: 'jukb imzw cejs pjlq',
    },
    tls: {
        rejectUnauthorized: false,  
    },
    debug: true,
    logger: true,
});



// Create route
router.post('/create', [
    body('name').isAlpha().withMessage('Name must contain only letters').trim().notEmpty(),
    body('surname').isAlpha().withMessage('Surname must contain only letters').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/),
    body('role').isIn(['customer', 'employee', 'admin']).withMessage('Role must be either customer, employee, or admin')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, email, password, role } = req.body;

    try {
        await client.connect();
        const db = client.db('APDS7311'); // Replace with your actual database name

        let collection;
        let prefix;
        if (role === 'customer') {
            collection = db.collection('customers');
            prefix = 'CUST';
        } else if (role === 'employee') {
            collection = db.collection('employees');
            prefix = 'EMP';
        } else if (role === 'admin') {
            collection = db.collection('admins');
            prefix = 'AD';
        }

        let user = await collection.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Generate random 8-digit ID for the new user
        const randomId = Math.floor(10000000 + Math.random() * 90000000);
        const newUserId = `${prefix}${randomId}`; // Renamed to newUserId to avoid conflict

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        user = {
            _id: newUserId, // Use newUserId here
            name,
            surname,
            email,
            password: hashedPassword,
            role
        };

        await collection.insertOne(user);

        // Send welcome email
        const mailOptions = {
            from: 'unisafeapp7319@gmail.com',
            to: email,
            subject: `Welcome to the ${prefix} - UniSafe App`,
            text: `Dear ${name} ${surname},
            
            Welcome to the UniSafe App! We are thrilled to have you as part of our community.
            
            Your login credentials are as follows:
            
            User ID: ${newUserId}
            Password: ${password}
            
            Please keep these credentials secure.
            
            Best regards,
            UniSafe Team`
        };

        // Send email
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Email error:', err.message);
                return res.status(500).json({ error: 'User created, but email failed to send.' });
            }
            console.log('Email sent:', info.response);
        });

        res.status(201).json({ msg: 'User created successfully', userId: newUserId });
    } catch (err) {
        console.error('Error during user creation:', err.message);
        res.status(500).send('Server error');
    } finally {
        await client.close();
    }
});

// Login route
router.post('/login', [
    body('userId').matches(/^(CUST|EMP|AD)\d{8}$/).withMessage('Invalid User ID format'), // Ensure userId follows the correct pattern
    body('password').exists().withMessage('Password is required')  // Ensure password is provided
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, password } = req.body;

    try {
        await client.connect();
        const db = client.db('APDS7311'); // Replace with your actual database name

        // Determine the collection based on userId prefix (CUST, EMP, AD)
        let user;
        let role;

        if (userId.startsWith('CUST')) {
            user = await db.collection('customers').findOne({ _id: userId });
            role = 'customer';
        } else if (userId.startsWith('EMP')) {
            user = await db.collection('employees').findOne({ _id: userId });
            role = 'employee';
        } else if (userId.startsWith('AD')) {
            user = await db.collection('admins').findOne({ _id: userId });
            role = 'admin';
        }

        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // If password is correct, create and send the JWT token
        const payload = { user: { id: user._id, role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            // Return the token and user info in the response
            res.json({
                token,
                user: {
                    id: user._id,  // Ensure that userId is included here
                    role: role
                }
            });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    } finally {
        await client.close();
    }
});

module.exports = router;
