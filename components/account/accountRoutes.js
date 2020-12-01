const account = require('express').Router();
const accountController = require('./accountController');
const middleware = require('../utils/middleware');

account.get(
  '/account',
  middleware.isAuthenticated,
  accountController.getAccount
);
account.post(
  '/account/delete',
  middleware.isAuthenticated,
  accountController.postDeleteAccount
);
account.get(
  '/account/unlink/:provider',
  middleware.isAuthenticated,
  accountController.getOauthUnlink
);

module.exports = account;
