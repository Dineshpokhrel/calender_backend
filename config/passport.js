import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js'; 
import dotenv from "dotenv"

dotenv.config({
  path: './.env'
})

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user ID to session
});

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user); // Deserialize user from session
//   });
// });

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Use async/await with findById
    done(null, user); // Deserialize user from session
  } catch (err) {
    done(err);
  }
});

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL =  process.env.GOOGLE_CALLBACK_URL;

// console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
// console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
// console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);

passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL,
    authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenURL: "https://oauth2.googleapis.com/token",
    scope: [
        "profile",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
    ],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // If user exists, update tokens
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();
        return done(null, user);
      } else {
        // If user doesn't exist, create a new user
        user = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          accessToken,
          refreshToken
        });
        await user.save();
        return done(null, user);
      }
    } catch (err) {
      return done(err);
    }
  }
));

export default passport;
