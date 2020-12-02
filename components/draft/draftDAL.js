const Project = require('../../models/Project');

exports.getProjectByUserId = async (userId) =>
  Project.findOne({ user: userId, isPublished: false }).lean();

exports.getLatestProject = async (userId) =>
  Project.findOne({ user: userId, isPublished: true })
    .sort({ createdAt: -1 })
    .lean();

exports.createProject = async (fields) => {
  const project = await Project.create(fields);
  return project;
};

exports.updateProjectById = async ({ id, fields = {} }) => {
  const project = await Project.findOneAndUpdate({ _id: id }, fields, {
    upsert: true
  }).lean();
  return project;
};

exports.deleteProjectByUserId = async (userId) =>
  Project.deleteOne({ user: userId }).lean();
