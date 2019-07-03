const router = require('express').Router();
const requireLogin = require('../middlewares/requireLogin');
const { uploadService } = require('../services');

router.get('/api/upload', requireLogin, (req, res) => {
  uploadService.uploadS3(req, res);
});

module.exports = router;
