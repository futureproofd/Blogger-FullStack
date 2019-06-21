const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  // route handler runs first
  await next();
  // if execution passes, then clear cache
  clearHash(req.user.id);
};
