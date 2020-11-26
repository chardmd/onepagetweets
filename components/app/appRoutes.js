const routes = require('express').Router();

/**
 * Route handlers
 */
const auth = require('../auth/authRoutes');
const post = require('../post/postRoutes');
const home = require('../home/homeRoutes');
const account = require('../account/accountRoutes');
const admin = require('../admin/adminRoutes');
const policy = require('../policy/policyRoutes');

routes.use(auth);
routes.use(post);
routes.use(account);
routes.use(home);
routes.use(admin);
routes.use(policy);

module.exports = routes;
