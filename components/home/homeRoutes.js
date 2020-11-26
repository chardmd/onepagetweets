const home = require('express').Router();
const homeController = require('./homeController');

home.get('/', homeController.getHome);
home.get('/:username', homeController.getDetails);
module.exports = home;
