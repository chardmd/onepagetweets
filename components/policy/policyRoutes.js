const policy = require('express').Router();
const policyController = require('./policyController');

policy.get('/policy/terms', policyController.getTermsOfService);
policy.get('/policy/privacy', policyController.getPrivacy);
policy.get('/policy/contact', policyController.getContact);

module.exports = policy;
