// calendarServices.js

import { fetchAccessToken, fetchCalendarEvents, createEvent, deleteEvent } from './googleServices';
import { refreshToken } from '../models/User'

// Function to fetch calendar events for a user
export const getUserCalendarEvents = async (accessToken, timeMin, timeMax, calendarId) => {
  try {
    // Fetch the access token if needed
    if (!accessToken) {
      accessToken = await fetchAccessToken(refreshToken); // You need to define refreshToken or retrieve it from somewhere
    }
    const events = await fetchCalendarEvents(accessToken, timeMin, timeMax, calendarId);
    return events;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};

// Function to create a new calendar event
export const addCalendarEvent = async (accessToken, eventDetails) => {
  try {
    // Fetch the access token if needed
    if (!accessToken) {
      accessToken = await fetchAccessToken(refreshToken); // You need to define refreshToken or retrieve it from somewhere
    }
    const newEvent = await createEvent(accessToken, eventDetails);
    return newEvent;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

// Function to delete a calendar event
export const removeCalendarEvent = async (accessToken, eventId, calendarId) => {
  try {
    // Fetch the access token if needed
    if (!accessToken) {
      accessToken = await fetchAccessToken(refreshToken); // You need to define refreshToken or retrieve it from somewhere
    }
    const deletedEvent = await deleteEvent(accessToken, eventId, calendarId);
    return deletedEvent;
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
};
