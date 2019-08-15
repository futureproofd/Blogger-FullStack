/* eslint-disable global-require */
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const {
  authController,
  blogController,
  uploadController,
} = require('./controllers');

// todo separate database connection into app / server so we can require app in our tests without instantiating a production database
// at the same time... that or we continue using keys
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });

const app = express();
/**
 * Middlewares
 */
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  }),
);

app.use(passport.initialize());
app.use(passport.session());
// route event handlers
app.use('/', authController, blogController, uploadController);

// production file serving
if (['production', 'ci'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV === 'test') {
  app.listen(5001, () => {
    console.log('Listening on port', PORT);
  });
} else {
  app.listen(PORT, () => {
    console.log('Listening on port', PORT);
  });
}

module.exports = app;
