const _ = require('lodash');
const validator = require('validator');
const DraftDAL = require('./draftDAL');
const DraftService = require('./draftService');

/**
 * GET /draft/editor
 */
exports.getEditor = async (req, res) => {
  const { user } = req;
  const project = await DraftDAL.getProjectByUserId(user.id);
  res.render('draft/client/editor', {
    title: 'Editor',
    content: project !== null ? project.content : '',
    bgColor: project !== null ? project.bgColor : ''
  });
};

/**
 * GET /draft/preview
 */
exports.getPreview = async (req, res) => {
  const { user } = req;
  const project = await DraftDAL.getProjectByUserId(user.id);
  res.render('draft/client/preview', {
    title: 'Preview',
    content: project !== null ? project.content : '',
    bgColor: project !== null ? project.bgColor : ''
  });
};

/**
 * GET /draft/success
 */
exports.getSuccess = async (req, res) => {
  const user = req.user.toObject();
  const project = await DraftDAL.getLatestProject(req.user.id);
  const { postId } = project;
  res.render('draft/client/success', {
    title: 'Success',
    postId,
    user,
    baseUrl: process.env.BASE_URL
  });
};

/**
 * POST /draft/editor
 */
exports.postEditor = async (req, res) => {
  const { content = '', bgColor } = req.body;

  const validationErrors = [];
  if (validator.isEmpty(content)) {
    validationErrors.push({
      msg: 'Please enter content.'
    });
  }
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect(`/draft/editor`);
  }

  try {
    const unpublishedProject = await DraftDAL.getProjectByUserId(req.user.id);
    if (_.isNil(unpublishedProject)) {
      await DraftDAL.createProject({
        user: req.user.id,
        content,
        bgColor
      });
    } else {
      await DraftDAL.updateProjectById({
        id: unpublishedProject._id,
        fields: {
          content,
          bgColor
        }
      });
    }
  } catch (err) {
    console.log({ err });
    validationErrors.push({
      msg: 'Error creating project. Please try again.'
    });
    req.flash('errors', validationErrors);
    return res.redirect(`/draft/editor`);
  }

  return res.status(200).json({ msg: 'success' });
};

/**
 *
 * Delete Unpublished Project
 */
exports.deleteDraft = async (req, res) => {
  const unpublishedProject = await DraftDAL.getProjectByUserId(req.user.id);
  if (!_.isNull(unpublishedProject)) {
    await DraftDAL.deleteProjectByUserId(unpublishedProject._id);
  }
  res.status(204).end();
};

/**
 * PATCH /draft/publish
 */
exports.publish = async (req, res) => {
  const { user, body } = req;
  const { compressed } = body;
  let base64 = DraftService.decompressPayload(compressed);
  const unpublishedProject = await DraftDAL.getProjectByUserId(req.user.id);
  if (!_.isNil(unpublishedProject) && !unpublishedProject.isPublished) {
    const postId = await DraftService.uploadToTwitter(user, base64);
    await DraftDAL.updateProjectById({
      id: unpublishedProject._id,
      fields: {
        postId,
        isPublished: true
      }
    });
  }
  res.status(204).end();
};
