const post = require('express').Router();
const postController = require('./postController');
const middlewareUtil = require('../utils/middleware');

/**
 * GET
 */
post.get(
  '/post/about',
  middlewareUtil.isAuthenticated,
  postController.getAbout
);
post.get(
  '/post/preview',
  middlewareUtil.isAuthenticated,
  postController.getPreview
);
post.get(
  '/post/success',
  middlewareUtil.isAuthenticated,
  postController.getSuccess
);

post.get(
  '/post/:username',
  middlewareUtil.isAuthenticated,
  postController.getDetails
);

/** POST */
post.post(
  '/post/about',
  middlewareUtil.isAuthenticated,
  postController.postAbout
);

/** PATCH */
post.patch(
  '/post/publish',
  middlewareUtil.isAuthenticated,
  postController.publish
);

module.exports = post;
