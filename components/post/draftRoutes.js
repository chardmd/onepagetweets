const draft = require('express').Router();
const draftController = require('./draftController');
const middlewareUtil = require('../utils/middleware');

/**
 * GET
 */
draft.get(
  '/post/about',
  middlewareUtil.isAuthenticated,
  draftController.getAbout
);
draft.get(
  '/post/preview',
  middlewareUtil.isAuthenticated,
  draftController.getPreview
);
draft.get(
  '/post/success',
  middlewareUtil.isAuthenticated,
  draftController.getSuccess
);

/** POST */
draft.post(
  '/post/about',
  middlewareUtil.isAuthenticated,
  draftController.postAbout
);

/** PATCH */
draft.post(
  '/post/publish',
  middlewareUtil.isAuthenticated,
  draftController.publish
);

module.exports = draft;
