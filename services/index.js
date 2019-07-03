const passport = require('passport');

const BlogService = require('./blogService');
const AuthService = require('./authService');
const UploadService = require('./uploadService');

const { Blog } = require('../models');
// apply our strategry configuration to passport
require('../services/passportService')(passport);
// apply our cache implementation to mongoose query prototype
require('./cache');
/**
 * Instantiate all objects with their required, instantiated dependencies
 */
const blogService = new BlogService(Blog);
const authService = new AuthService(passport);
const uploadService = new UploadService();

module.exports = {
  blogService,
  authService,
  uploadService,
};
