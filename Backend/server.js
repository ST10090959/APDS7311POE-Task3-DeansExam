// Import necessary modules
const express = require('express');
const http = require('http');  // Change from https to http
const fs = require('fs');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const expressBrute = require('express-brute');
const connectDB = require('./config/db');

// Import the payment routes
const paymentRoutes = require('./routes/payments');  // Add this line

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Define the port and app
const PORT = process.env.PORT || 8443;
const app = express();

// Security middleware
app.use(express.json());
app.use(helmet());
app.use(xss());

// CORS setup
const corsOptions = {
  origin: 'http://localhost:3000', // Ensure this matches your React app URL
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

// Rate limiting setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Brute-force protection
const bruteStore = new expressBrute.MemoryStore();
const bruteForce = new expressBrute(bruteStore);
app.use(bruteForce.prevent);

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payments', paymentRoutes); // Add payment routes here

// Start HTTP server (no SSL options)
http.createServer(app).listen(PORT, () => {
  const current = new Date().toLocaleString();
  console.log(`Server running on http://localhost:${PORT} @ ${current}`);
});
