// routes/authRoutes.js

import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();

router.get(
  '/google',
  (req, res, next) => {
    console.log('Initiating Google authentication...');
    next();
  },
  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
    accessType: 'offline',
  })
);

router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('Handling Google callback...');
    next();
  },
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => {
    console.log('Redirecting after successful authentication...');
    res.redirect('/');
  }
);

router.get('/logout', (req, res) => {
  console.log('Logging out user...');
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    } else {
      console.log('Session destroyed successfully.');
    }
  });
  res.redirect('/');
});

export default router;
