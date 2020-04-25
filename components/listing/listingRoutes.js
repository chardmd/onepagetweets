const listing = require('express').Router();
const listingsController = require('./listingController');

listing.get('/', listingsController.getHome);
listing.get('/:username', listingsController.getDetails);
module.exports = listing;
