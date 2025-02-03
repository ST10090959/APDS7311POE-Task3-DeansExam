// Import necessary modules
const express = require('express');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const expressBrute = require('express-brute');
const connectDB = require('./config/db');

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

const corsOptions = {
  origin: 'http://localhost:3000', // Ensure this matches your React app URL
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use(limiter);

// Brute-force protection
const bruteStore = new expressBrute.MemoryStore();
const bruteForce = new expressBrute(bruteStore);
app.use(bruteForce.prevent);

// API routes
app.use('/api/auth', require('./routes/auth'));

// SSL configuration
const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY),
  cert: fs.readFileSync(process.env.SSL_CERT)
};

// Start HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  const current = new Date().toLocaleString();
  console.log(`Secure server running on port ${PORT} @ ${current}`);
});
