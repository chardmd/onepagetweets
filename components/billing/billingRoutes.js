const billing = require('express').Router();
const billingController = require('./billingController');
const middlewareUtil = require('../utils/middleware');

billing.get(
  '/billing',
  middlewareUtil.isAuthenticated,
  billingController.getBilling
);
billing.post(
  '/billing/projects/:projectId/create-checkout-session',
  middlewareUtil.isAuthenticated,
  billingController.createCheckoutSession
);
billing.get(
  '/billing/success',
  middlewareUtil.isAuthenticated,
  billingController.getSuccess
);

module.exports = billing;
