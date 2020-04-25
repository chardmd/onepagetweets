const Project = require('../../models/Project');

exports.getProjectByUserId = async userId => Project.findOne({ user: userId });

exports.updateProjectByUserId = async ({ userId, fields = {} }) => {
  const project = await Project.findOneAndUpdate(
    {
      user: userId
    },
    fields,
    {
      upsert: true
    }
  );
  return project;
};
