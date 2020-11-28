const validator = require('validator');
const DraftDAL = require('./draftDAL');
const DraftService = require('./draftService');
const Project = require('../../models/Project');

/**
 * GET /draft/editor
 */
exports.getEditor = async (req, res) => {
  const { user } = req;
  const project = await DraftDAL.getProjectByUserId(user.id);
  res.render('draft/client/editor', {
    title: 'Editor',
    summary: project !== null ? project.summary : ''
  });
};

/**
 * GET /draft/preview
 */
exports.getPreview = async (req, res) => {
  const { user } = req;
  const { username } = user.profile;
  const project = await DraftDAL.getProjectByUserId(user.id);
  res.render('draft/client/preview', {
    title: 'Preview Website',
    username,
    headline: project !== null ? project.headline : '',
    fullName: project !== null ? project.fullName : '',
    summary: project !== null ? project.summary : '',
    techStack: project !== null ? project.techStack : []
  });
};

/**
 * GET /draft/success
 */
exports.getSuccess = async (req, res) => {
  const { user } = req;
  const { username } = user.profile;
  res.render('draft/client/success', {
    title: 'Success',
    username,
    baseUrl: process.env.BASE_URL
  });
};

/**
 * POST /draft/editor
 */
exports.postEditor = async (req, res) => {
  const { summary = '' } = req.body;

  const { user } = req;

  const validationErrors = [];
  if (validator.isEmpty(summary)) {
    validationErrors.push({
      msg: 'Please enter summary.'
    });
  }
  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect(`/draft/editor`);
  }

  try {
    await DraftDAL.updateProjectByUserId({
      userId: user.id,
      fields: {
        summary,
        isPublished: false
      }
    });
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
 * PATCH /draft/publish
 */
exports.publish = async (req, res) => {
  const { user, body } = req;
  const { screenshot } = body;

  const postId = await DraftService.uploadToTwitter(user, screenshot);

  await Project.findOneAndUpdate(
    {
      user: user.id
    },
    { $push: { postIds: postId } }
  );

  const project = await DraftDAL.getProjectByUserId(user.id);
  if (!project.isPublished) {
    await DraftDAL.updateProjectByUserId({
      userId: user.id,
      fields: {
        isPublished: true
      }
    });
  }
  res.status(204).end();
};
