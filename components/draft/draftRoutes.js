const draft = require('express').Router();
const draftController = require('./draftController');
const middleware = require('../utils/middleware');

/**
 * GET
 */
draft.get(
  '/draft/editor',
  middleware.isAuthenticated,
  draftController.getEditor
);
draft.get(
  '/draft/preview',
  middleware.isAuthenticated,
  draftController.getPreview
);
draft.get(
  '/draft/success',
  middleware.isAuthenticated,
  draftController.getSuccess
);

/** POST */
draft.post(
  '/draft/editor',
  middleware.isAuthenticated,
  draftController.postEditor
);

/** PATCH */
draft.post(
  '/draft/publish',
  middleware.isAuthenticated,
  //middleware.parsePako,
  draftController.publish
);

/** DELETE */
draft.delete(
  '/draft/delete',
  middleware.isAuthenticated,
  draftController.deleteDraft
);

module.exports = draft;
