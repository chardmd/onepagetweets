const routes = require('express').Router();

/**
 * Route handlers
 */
const auth = require('../auth/authRoutes');
const post = require('../post/postRoutes');
const listing = require('../listing/listingRoutes');
const account = require('../account/accountRoutes');
const admin = require('../admin/adminRoutes');
const policy = require('../policy/policyRoutes');

routes.use(auth);
routes.use(post);
routes.use(account);
routes.use(listing);
routes.use(admin);
routes.use(policy);

module.exports = routes;
