const draft = require('express').Router();
const draftController = require('./draftController');
const middlewareUtil = require('../utils/middleware');

/**
 * GET
 */
draft.get(
  '/draft/editor',
  middlewareUtil.isAuthenticated,
  draftController.getEditor
);
draft.get(
  '/draft/preview',
  middlewareUtil.isAuthenticated,
  draftController.getPreview
);
draft.get(
  '/draft/success',
  middlewareUtil.isAuthenticated,
  draftController.getSuccess
);

/** POST */
draft.post(
  '/draft/editor',
  middlewareUtil.isAuthenticated,
  draftController.postEditor
);

/** PATCH */
draft.post(
  '/draft/publish',
  middlewareUtil.isAuthenticated,
  draftController.publish
);

module.exports = draft;
