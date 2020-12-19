const account = require('express').Router();
const accountController = require('./accountController');
const middleware = require('../utils/middleware');

account.get(
  '/account',
  middleware.isAuthenticated,
  accountController.getAccount
);
account.get(
  '/account/unlink/:provider',
  middleware.isAuthenticated,
  accountController.getOauthUnlink
);

account.put(
  '/account/cancel',
  middleware.isAuthenticated,
  accountController.putCancelSubscription
);

module.exports = account;
