// routes/userRoutes.js

import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated';
import { getUserCalendarList } from '../services/calendarService';

const router = express.Router();

// Route to get user's calendars
router.get('/calendars', isAuthenticated, async (req, res) => {
    try {
      const userCalendars = await getUserCalendarList(req.user.accessToken);
      res.json(userCalendars);
    } catch (error) {
      console.error('Error fetching user calendars:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/profile', isAuthenticated, async (req, res) => {
    res.json(req.user);
});

export default router;
