const routes = require('express').Router();

/**
 * Route handlers
 */
const auth = require('../auth/authRoutes');
const draft = require('../draft/draftRoutes');
const home = require('../home/homeRoutes');
const account = require('../account/accountRoutes');
const admin = require('../admin/adminRoutes');
const policy = require('../policy/policyRoutes');

routes.use(auth);
routes.use(draft);
routes.use(account);
routes.use(home);
routes.use(admin);
routes.use(policy);

module.exports = routes;
