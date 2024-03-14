// routes/userRoutes.js

import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getUserCalendarList } from '../services/calendarService.js';

const router = express.Router();

// Route to get user's calendars
router.get('/calendars', isAuthenticated, async (req, res) => {
    try {
      const { accessToken, refreshToken } = req.user; 
      //const { timeMin, timeMax, calendarId } = req.query;
      const userCalendars = await getUserCalendarList(accessToken, refreshToken);
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
