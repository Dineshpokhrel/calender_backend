// import { google } from 'googleapis';


// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_CALLBACK_URL
// );

// // Function to retrieve the access token using the refresh token
// const fetchAccessToken = async (refreshToken) => {
//   try {
//     oAuth2Client.setCredentials({ refresh_token: refreshToken });
//     const { token, expiry_date } = await oAuth2Client.getAccessToken();
//     return { token, expiry_date };
//   } catch (error) {
//     console.error("Error getting access token:", error);
//     throw error;
//   }
// };

// // Function to fetch events from the user's calendars
// const fetchCalendarEvents = async (accessToken, timeMin, timeMax, calendarId) => {
//   const calendar = google.calendar({ version: "v3", auth: accessToken });
//   // console.log('accessToken1 :', accessToken);
//   //console.log('refreshToken2 :', refreshToken);

//   try {
//     //console.log('accessToken:', accessToken);
//     // console.log('refreshToken:', refreshToken);
//     const calendarList = calendarId?.length
//       ? calendarId
//       : (await getUserCalendarList(accessToken)).items?.map((calendar) => calendar.id);

//     if (!calendarList) return [];

//     const events = await Promise.all(calendarList.map(async (calendarId) => {
//       const response = await calendar.events.list({
//         //auth: oAuth2Client,
//         //oauth_token: accessToken,
//         calendarId: calendarId,
//         timeMin: new Date(timeMin).toISOString(),
//         timeMax: new Date(timeMax).toISOString(),
//         maxResults: 10,
//         singleEvents: true,
//         orderBy: "startTime"
//       });
//       return response.data.items?.map((event) => ({
//         ...event,
//         calendarId,
//         accessRole: response.data.accessRole,
//         calendarSummary: response.data.summary
//       }));
//     }));
//     return events.flat();
//   } catch (error) {
//     console.error("Error retrieving calendar events:", error);
//     throw error;
//   }
// };

// // Function to create a new calendar event
// const createEvent = async (accessToken, requestBody) => {
//   const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

//   try {
//     const { calendarId, ...body } = requestBody;
//     const response = await calendar.events.insert({
//       auth: oAuth2Client,
//       oauth_token: accessToken,
//       calendarId: calendarId || "primary",
//       requestBody: body,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error creating calendar event:", error);
//     throw error;
//   }
// };

// // Function to delete a calendar event
// const deleteEvent = async (accessToken, eventId, calendarId) => {
//   const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

//   try {
//     const response = await calendar.events.delete({
//       auth: oAuth2Client,
//       oauth_token: accessToken,
//       calendarId: calendarId || "primary",
//       eventId: eventId,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting calendar event:", error);
//     throw error;
//   }
// };



// const getUserCalendarList = async (accessToken) => {
//   const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

//   try {
//     const response = await calendar.calendarList.list({
//       auth: accessToken
//       //oauth_token: accessToken,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error retrieving calendar list:", error);
//     throw error;
//   }
// };



// // Function to get user's calendar list
// // const getUserCalendarList = async (accessToken) => {
// //   const calendar = google.calendar({ version: "v3", auth: accessToken });
// //   // console.log('accessToken3 :', accessToken);
// //   //console.log('refreshToken4 :', refreshToken);
// //   console.log('i am here 3');
// //   try {
// //     // const response = await calendar.calendarList.list({
// //     //   //auth: oAuth2Client,
// //     //   auth: accessToken,
// //     //   //oauth_token: accessToken,
// //     // });
// //     const response = await calendar.calendarList.list();
// //     console.log('i am here 4');
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error retrieving calendar list:", error);
// //     throw error;
// //   }
// // };

// export { fetchAccessToken, fetchCalendarEvents, createEvent, deleteEvent };







import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

const fetchAccessToken = async (refreshToken) => {
  try {
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    const { token, expiry_date } = await oAuth2Client.getAccessToken();
    return { token, expiry_date };
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
};

const fetchCalendarEvents = async (accessToken, timeMin, timeMax, calendarId) => {
  const calendar = google.calendar({ version: "v3", auth: accessToken });
  try {
    const response = await calendar.events.list({
      calendarId: calendarId || 'primary',
      timeMin,
      timeMax,
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items || [];
  } catch (error) {
    console.error("Error retrieving calendar events:", error);
    throw error;
  }
};

const createEvent = async (accessToken, requestBody) => {
  const calendar = google.calendar({ version: "v3", auth: accessToken });
  try {
    const { calendarId, ...body } = requestBody;
    const response = await calendar.events.insert({
      calendarId: calendarId || "primary",
      requestBody: body,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
};

const deleteEvent = async (accessToken, eventId, calendarId) => {
  const calendar = google.calendar({ version: "v3", auth: accessToken });
  try {
    const response = await calendar.events.delete({
      calendarId: calendarId || "primary",
      eventId,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    throw error;
  }
};

const getUserCalendarList = async (accessToken) => {
  const calendar = google.calendar({ version: "v3", auth: accessToken });
  try {
    const response = await calendar.calendarList.list();
    return response.data.items || [];
  } catch (error) {
    console.error("Error retrieving calendar list:", error);
    throw error;
  }
};

export { fetchAccessToken, fetchCalendarEvents, createEvent, deleteEvent, getUserCalendarList };
