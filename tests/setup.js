/* eslint-disable no-undef */
jest.setTimeout(40000);
// automatically supply user model
require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
