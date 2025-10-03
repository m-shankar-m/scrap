// C:\Users\Hp\Downloads\temp\scrap-backend\server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 5000;

// Import Models
const User = require('./models/User');
const Price = require('./models/Price'); // Import Price Model

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

// Middleware to protect routes (Authentication)
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request (excluding password)
      req.user = decoded.user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// @route    POST /api/users/register
// @desc     Register a new user
// @access   Public
app.post('/api/users/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
    });

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST /api/users/login
// @desc     Authenticate user & get token
// @access   Public
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET /api/prices
// @desc     Get all scrap material prices
// @access   Public
app.get('/api/prices', async (req, res) => {
  try {
    const prices = await Price.find({});
    res.json(prices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST /api/prices
// @desc     Add a new scrap material price (or update existing)
// @access   Private (Admin only) - using 'protect' middleware
app.post('/api/prices', protect, async (req, res) => {
  const { material, price } = req.body;

  try {
    let priceItem = await Price.findOne({ material });

    if (priceItem) {
      // Update existing price
      priceItem.price = price;
      priceItem.lastUpdated = Date.now();
      await priceItem.save();
      return res.json(priceItem);
    } else {
      // Add new price
      priceItem = new Price({
        material,
        price,
      });
      await priceItem.save();
      return res.status(201).json(priceItem);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});