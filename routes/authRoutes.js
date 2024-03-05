// routes/authRoutes.js

import express from 'express';
import passport from '../config/passport';

const router = express.Router();

router.get(
  '/auth/google',
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
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect('/');
});

export default router;
