const Project = require('../../models/Project');

exports.getProjectByUserId = async (userId) =>
  Project.findOne({ user: userId, isPublished: false }).lean();

exports.updateProjectByUserId = async ({ userId, fields = {} }) => {
  const project = await Project.findOneAndUpdate(
    {
      user: userId
    },
    fields,
    {
      upsert: true
    }
  ).lean();
  return project;
};
