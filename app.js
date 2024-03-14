import express from 'express';
import dotenv from "dotenv";
import session from 'express-session';
import passport from './config/passport.js';
import { connectDB, createMongoStore}  from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';
import axios from 'axios';
//import './config/dotenv.js';

dotenv.config({
  path: './.env'
})

// const clientID = process.env.GOOGLE_CLIENT_ID;
// const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
// const callbackURL =  process.env.GOOGLE_CALLBACK_URL;

// console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
// console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
// console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
//console.log(process.env)

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// // Middleware for session management
// app.use(session({
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: false,
// }));

// Initialize MongoDB session store
const mongoStore = await createMongoStore();

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: mongoStore, // Use the MongoDB session store
  })
);


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
