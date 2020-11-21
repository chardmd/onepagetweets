const validator = require('validator');
const PostDAL = require('./postDAL');

/**
 * GET /post/about
 */
exports.getAbout = async (req, res) => {
  const { user } = req;
  const project = await PostDAL.getProjectByUserId(user.id);
  res.render('post/client/about', {
    title: 'About Info',
    summary: project !== null ? project.summary : ''
  });
};

/**
 * GET /post/preview
 */
exports.getPreview = async (req, res) => {
  const { user } = req;
  const { username } = user.profile;
  const project = await PostDAL.getProjectByUserId(user.id);
  res.render('post/client/preview', {
    title: 'Preview Website',
    username,
    headline: project !== null ? project.headline : '',
    fullName: project !== null ? project.fullName : '',
    summary: project !== null ? project.summary : '',
    techStack: project !== null ? project.techStack : []
  });
};

/**
 * GET /post/:username
 */
exports.getDetails = async (req, res) => {
  const { user } = req;
  const { username } = user.profile;
  const project = await PostDAL.getProjectByUserId(user.id);
  res.render('listing/client/details', {
    title: 'Home',
    layout: 'basic',
    username,
    preview: true,
    headline: project !== null ? project.headline : '',
    fullName: project !== null ? project.fullName : '',
    summary: project !== null ? project.summary : '',
    techStack: project !== null ? project.techStack : [],
    baseUrl: process.env.BASE_URL
  });
};

/**
 * GET /post/success
 */
exports.getSuccess = async (req, res) => {
  const { user } = req;
  const { username } = user.profile;
  res.render('post/client/success', {
    title: 'Success',
    username,
    baseUrl: process.env.BASE_URL
  });
};

/**
 * POST /post/about
 */
exports.postAbout = async (req, res) => {
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
    return res.redirect(`/post/about`);
  }

  try {
    await PostDAL.updateProjectByUserId({
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
    return res.redirect(`/post/about`);
  }

  return res.status(200).json({ msg: 'success' });
};

/**
 * PATCH /post/publish
 */
exports.publish = async (req, res) => {
  const { user, body } = req;
  const { screenshot } = body;
  console.log('------------------------------------');
  console.log(screenshot);
  console.log('------------------------------------');
  const project = await PostDAL.getProjectByUserId(user.id);
  if (!project.isPublished) {
    await PostDAL.updateProjectByUserId({
      userId: user.id,
      fields: {
        isPublished: true
      }
    });
  }
  res.status(204).end();
};
