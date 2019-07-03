/* eslint-disable no-undef */
jest.setTimeout(50000);
// automatically supply user model
require('../models/UserModel');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
