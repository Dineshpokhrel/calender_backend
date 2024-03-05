import express from 'express';
import session from 'express-session';
import passport from './config/passport';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import userRoutes from './routes/userRoutes';
//import './config/dotenv.js';

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware for session management
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware for parsing JSON bodies
app.use(express.json());

// Routes for authentication
app.use('/auth', authRoutes);

// Routes for CRUD operations on events
app.use('/events', eventRoutes);

// Routes for user-related operations
app.use('/user', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
