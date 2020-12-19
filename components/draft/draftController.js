const _ = require('lodash');
const validator = require('validator');
const DraftDAL = require('./draftDAL');
const DraftService = require('./draftService');
const DraftConstant = require('./draftConstant');
const { isNil } = require('lodash');

/**
 * GET /draft/editor
 */
exports.getEditor = async (req, res) => {
  const { user } = req;

  //forbid accessing the page
  const billing = await DraftDAL.getBilling(req.user._id);
  const totalProjectCount = await DraftDAL.countProjectTotal(req.user.id);
  if (
    (_.isNil(billing) &&
      totalProjectCount >= parseInt(process.env.MAX_PROJECT_COUNT, 10)) ||
    (!_.isNil(billing) && !billing.isActive)
  ) {
    return res.redirect(`/`);
  }

  const project = await DraftDAL.getProjectByUserId(user.id);
  res.render('draft/client/editor', {
    title: 'Editor',
    content: project !== null ? project.content : '',
    bgColor: project !== null ? project.bgColor : '',
    colors: DraftConstant.colors
  });
};

/**
 * GET /draft/preview
 */
exports.getPreview = async (req, res) => {
  const { user } = req;

  //forbid accessing the page
  const billing = await DraftDAL.getBilling(req.user._id);
  const totalProjectCount = await DraftDAL.countProjectTotal(req.user.id);
  if (
    (_.isNil(billing) &&
      totalProjectCount >= parseInt(process.env.MAX_PROJECT_COUNT, 10)) ||
    (!_.isNil(billing) && !billing.isActive)
  ) {
    return res.redirect(`/`);
  }

  const project = await DraftDAL.getProjectByUserId(user.id);
  res.render('draft/client/preview', {
    title: 'Preview',
    layout: 'main-desktop',
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
    let fields = {
      content
    };
    if (!_.isNil(bgColor)) {
      fields = {
        ...fields,
        bgColor
      };
    }
    if (!isNil(unpublishedProject)) {
      await DraftDAL.updateProjectById({
        id: unpublishedProject._id,
        fields
      });
    } else {
      await DraftDAL.createProject({
        user: req.user.id,
        ...fields
      });
    }
  } catch (err) {
    console.log({ err });
    validationErrors.push({
      msg: 'Error updating project. Please try again.'
    });
    req.flash('errors', validationErrors);
    return res.redirect(`/draft/editor`);
  }

  //success
  return res.redirect(`/draft/preview`);
};

/**
 *
 * Delete Unpublished Project
 */
exports.deleteDraft = async (req, res) => {
  const validationErrors = [];
  try {
    const unpublishedProject = await DraftDAL.getProjectByUserId(req.user.id);
    if (!_.isNull(unpublishedProject)) {
      await DraftDAL.deleteProjectByUserId(unpublishedProject._id);
    }
  } catch (ex) {
    console.log({ err });
    validationErrors.push({
      msg: 'Error deleting draft.'
    });
    req.flash('errors', validationErrors);
    return res.redirect(`/draft/editor`);
  }
  //success
  return res.redirect(`/draft/editor`);
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
