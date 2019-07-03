/* eslint-disable consistent-return */
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('User');

module.exports = function passportConfig(passport) {
  // passport takes the user id and stores it internally on req.session.passport
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // user profile from our DB is attached to the request handler at req.user
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        callbackURL: '/auth/google/callback',
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ googleId: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }
          const user = await new User({
            googleId: profile.id,
            displayName: profile.displayName,
          }).save();
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      },
    ),
  );
};
