import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL
);

// Function to retrieve the access token using the refresh token
const fetchAccessToken = async (refreshToken) => {
  oAuth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const { token } = await oAuth2Client.getAccessToken();
    return token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
};

// Function to fetch events from the user's calendars
const fetchCalendarEvents = async (accessToken, timeMin, timeMax, calendarId) => {
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  try {
    const calendarList = calendarId?.length
      ? calendarId
      : (await getUserCalendarList(accessToken)).items?.map((calendar) => calendar.id);

    if (!calendarList) return [];

    const events = await Promise.all(calendarList.map(async (calendarId) => {
      const response = await calendar.events.list({
        auth: oAuth2Client,
        calendarId: calendarId,
        timeMin: new Date(timeMin).toISOString(),
        timeMax: new Date(timeMax).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime"
      });
      return response.data.items?.map((event) => ({
        ...event,
        calendarId,
        accessRole: response.data.accessRole,
        calendarSummary: response.data.summary
      }));
    }));
    return events.flat();
  } catch (error) {
    console.error("Error retrieving calendar events:", error);
    throw error;
  }
};

// Function to create a new calendar event
const createEvent = async (accessToken, requestBody) => {
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  try {
    const { calendarId, ...body } = requestBody;
    const response = await calendar.events.insert({
      auth: oAuth2Client,
      calendarId: calendarId || "primary",
      requestBody: body,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
};

// Function to delete a calendar event
const deleteEvent = async (accessToken, eventId, calendarId) => {
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  try {
    const response = await calendar.events.delete({
      auth: oAuth2Client,
      calendarId: calendarId || "primary",
      eventId: eventId,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    throw error;
  }
};

// Function to get user's calendar list
const getUserCalendarList = async (accessToken) => {
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  try {
    const response = await calendar.calendarList.list({
      auth: oAuth2Client,
    });
    return response.data;
  } catch (error) {
    console.error("Error retrieving calendar list:", error);
    throw error;
  }
};

export { fetchAccessToken, fetchCalendarEvents, createEvent, deleteEvent };
