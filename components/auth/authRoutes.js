const passport = require('passport');
const auth = require('express').Router();

const authController = require('./authController');

/**
 * API keys and Passport configuration.
 */
auth.get('/logout', authController.logout);

auth.get('/auth/twitter', passport.authenticate('twitter'));
auth.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/'
  }),
  (req, res) => {
    res.redirect(req.session.returnTo || '/');
  }
);

module.exports = auth;
