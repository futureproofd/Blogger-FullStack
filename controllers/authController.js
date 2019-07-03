const router = require('express').Router();
const { authService } = require('../services');

router.get('/auth/google', authService.authGoogle());

router.get(
  '/auth/google/callback',
  authService.authGoogleCallback(),
  (req, res) => {
    res.redirect('/blogs');
  },
);

router.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

module.exports = router;
