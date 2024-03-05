// // config/passport.js

// import passport from 'passport';
// import './strategies/googleStrategy';

// export default passport;


import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/user'; // Assuming you have a User model defined

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user ID to session
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user); // Deserialize user from session
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
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
