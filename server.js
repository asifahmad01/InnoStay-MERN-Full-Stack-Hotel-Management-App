const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const passport = require('./auth'); // Custom passport configuration
const connectDB = require('./db'); // Import the connectDB function

const app = express();

// Middleware: log requests
const logRequest = (req, res, next) => {
  console.log(`${new Date().toLocaleString()} Request Made to: ${req.method} ${req.originalUrl}`);
  next();
};

// ✅ Enable CORS
app.use(cors({
  origin: "http://localhost:5173", // frontend URL (Vite)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(logRequest);
app.use(bodyParser.json()); // parse JSON bodies

// Initialize passport
app.use(passport.initialize());

// Define local authentication middleware
const localAuthMiddleware = passport.authenticate('local', { session: false });

// Protected route example
// app.get('/', localAuthMiddleware, (req, res) => {
//   res.send('Welcome Hotel Management System (protected)');
// });

// Public route
app.get('/', (req, res) => {
  res.send('Welcome Hotel Management System');
});

// Routes
const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');

app.use('/person', personRoutes);
app.use('/menu', menuRoutes);

// Server port
const PORT = process.env.PORT || 3000;

// Connect to MongoDB before starting the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});
