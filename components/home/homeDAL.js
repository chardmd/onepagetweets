const Project = require('../../models/Project');

exports.getProjects = async (userId) =>
  Project.find({ user: userId, isPublished: true }).lean();

exports.updateProjectPostIds = async (userId, postIds) =>
  Project.findOneAndUpdate(
    {
      user: userId
    },
    { postIds: postIds },
    {
      upsert: true
    }
  );

exports.deleteProjectsByIds = async (ids) =>
  Project.deleteMany({
    postId: {
      $in: ids
    }
  }).lean();
