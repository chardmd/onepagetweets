const Project = require('../../models/Project');

exports.getProjects = async (userId) =>
  await Project.find({ user: userId, isPublished: true }).lean();

exports.updateProjectPostIds = async (userId, postIds) =>
  await Project.findOneAndUpdate(
    {
      user: userId
    },
    { postIds: postIds },
    {
      upsert: true
    }
  );
