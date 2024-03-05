import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated';
import { getUserCalendarEvents, addCalendarEvent, removeCalendarEvent } from '../services/calendarServices';

const router = express.Router();

// Route for retrieving calendar events
router.get('/events', isAuthenticated, async (req, res) => {
  try {
    const { accessToken } = req.user; // Assuming accessToken is stored in the user object after authentication
    const { timeMin, timeMax, calendarId } = req.query;
    const events = await getUserCalendarEvents(accessToken, timeMin, timeMax, calendarId);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Route for creating a new calendar event
router.post('/events', isAuthenticated, async (req, res) => {
  try {
    const { accessToken } = req.user; // Assuming accessToken is stored in the user object after authentication
    const eventDetails = req.body;
    const newEvent = await addCalendarEvent(accessToken, eventDetails);
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Route for deleting a calendar event
router.delete('/events/:eventId', isAuthenticated, async (req, res) => {
  try {
    const { accessToken } = req.user; // Assuming accessToken is stored in the user object after authentication
    const { eventId } = req.params;
    const deletedEvent = await removeCalendarEvent(accessToken, eventId);
    res.json(deletedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

export default router;
