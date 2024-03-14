// calendarServices.js
import { google } from 'googleapis';
import axios from 'axios';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);



import { fetchAccessToken, fetchCalendarEvents, createEvent, deleteEvent } from './googleService.js';
//import { refreshToken } from '../models/User.js'

// const refreshAccessToken = async (refreshToken) => {
//   try {
//     const response = await axios.post('https://oauth2.googleapis.com/token', {
//       refresh_token: refreshToken,
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       grant_type: 'refresh_token',
//     });
//     return response.data.access_token;
//   } catch (error) {
//     console.error('Error refreshing access token:', error.message);
//     throw error;
//   }
// };

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
    throw error;
  }
};




// Function to fetch calendar events for a user
export const getUserCalendarEvents = async (accessToken, timeMin, timeMax, calendarId, refreshToken) => {
  try {
    // Fetch the access token if needed
    // console.log('accessToken:', accessToken);
    // console.log('refreshToken:', refreshToken);
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
export const addCalendarEvent = async (accessToken, eventDetails, refreshToken) => {
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
export const removeCalendarEvent = async (accessToken, eventId, calendarId, refreshToken) => {
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

// Function to get user's calendar list
// export const getUserCalendarList = async (accessToken) => {
//   const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

//   try {
//     const response = await calendar.calendarList.list({
//       auth: oAuth2Client,
//       oauth_token: accessToken,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error retrieving calendar list:", error);
//     throw error;
//   }
// };


// export const getUserCalendarList = async (accessToken) => {
//   const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

//   try {
//     const response =  await calendar.calendarList.list({
//       auth: accessToken
//       //oauth_token: accessToken,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error retrieving calendar list:", error);
//     throw error;
//   }
// };

// Function to fetch user's calendars
export const getUserCalendarList = async (accessToken, refreshToken) => {
  const calendar = google.calendar({ version: 'v3', auth: accessToken });

  try {
    const response = await calendar.calendarList.list();
    return response.data.items; // Return calendar items
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, handle token refresh
      const newAccessToken = await refreshAccessToken(refreshToken);
      // Retry the API call with the new access token
      const refreshedCalendar = await getUserCalendarList(newAccessToken, refreshToken);
      return refreshedCalendar;
    }
    console.error('Error retrieving calendar list:', error);
    throw error;
  }
};