const home = require('express').Router();
const homeController = require('./homeController');

home.get('/', homeController.getHome);

module.exports = home;
