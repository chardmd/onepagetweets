const home = require('express').Router();
const homeController = require('./homeController');
const middleware = require('../utils/middleware');

home.get('/', homeController.getHome);

/** POST */
home.post(
  '/home/create',
  middleware.isAuthenticated,
  homeController.postCreate
);

module.exports = home;
