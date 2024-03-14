import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getUserCalendarEvents, addCalendarEvent, removeCalendarEvent } from '../services/calendarService.js';

const router = express.Router();

// Route for retrieving calendar events
router.get('/events', isAuthenticated, async (req, res) => {
  try {
    //console.log('User:', req.user);
    const { accessToken, refreshToken } = req.user; // Assuming accessToken and refreshToken are stored in the user object after authentication
    const { timeMin, timeMax, calendarId } = req.query;
    // console.log('accessToken:', accessToken);
    // console.log('refreshToken:', refreshToken);
    const events = await getUserCalendarEvents(accessToken, timeMin, timeMax, calendarId, refreshToken);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Route for creating a new calendar event
router.post('/events', isAuthenticated, async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.user; // Assuming accessToken and refreshToken are stored in the user object after authentication
    const eventDetails = req.body;
    const newEvent = await addCalendarEvent(accessToken, eventDetails, refreshToken);
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Route for deleting a calendar event
router.delete('/events/:eventId', isAuthenticated, async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.user; // Assuming accessToken and refreshToken are stored in the user object after authentication
    const { eventId } = req.params;
    const deletedEvent = await removeCalendarEvent(accessToken, eventId, refreshToken);
    res.json(deletedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

export default router;
