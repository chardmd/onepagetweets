const account = require('express').Router();
const accountController = require('./accountController');
const middlewareUtil = require('../utils/middleware');

account.get(
  '/account',
  middlewareUtil.isAuthenticated,
  accountController.getAccount
);
account.post(
  '/account/delete',
  middlewareUtil.isAuthenticated,
  accountController.postDeleteAccount
);
account.get(
  '/account/unlink/:provider',
  middlewareUtil.isAuthenticated,
  accountController.getOauthUnlink
);

module.exports = account;
