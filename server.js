const express = require('express');
const app = express();
require('dotenv').config();
const passport = require('./auth'); // Custom passport configuration
const bodyParser = require('body-parser');

// Database connection
const db = require('./db'); // Ensure this is correctly set up in db.js

// Middleware to log incoming requests
const logRequest = (req, res, next) => {
  console.log(`${new Date().toLocaleString()} Request Made to: ${req.originalUrl}`);
  next();
};

app.use(logRequest);
app.use(bodyParser.json()); // Middleware to parse JSON request bodies

// Initialize passport
app.use(passport.initialize());

// Define local authentication middleware
const localAuthMiddleware = passport.authenticate('local', { session: false });

// Authentication-protected endpoint (uncomment when ready to use)
// app.get('/', localAuthMiddleware, (req, res) => {
//   res.send('Welcome Hotel Management System');
// });

// Public endpoint
app.get('/', (req, res) => {
  res.send('Welcome Hotel Management System');
});

// Import route files
const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');

// Routes
app.use('/menu', menuRoutes);
app.use('/person', personRoutes); // Protected route

// Server port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
