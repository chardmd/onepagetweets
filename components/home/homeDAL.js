const Project = require('../../models/Project');

exports.getProjectByUserId = async (userId) =>
  await Project.findOne({ user: userId }).lean();

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
