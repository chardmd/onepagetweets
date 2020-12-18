const Project = require('../../models/Project');
const Billing = require('../../models/Billing');

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
  const project = await Project.findOneAndUpdate({ _id: id }, fields).lean();
  return project;
};

exports.deleteProjectByUserId = async (id) =>
  Project.deleteOne({ _id: id }).lean();

exports.countProjectTotal = async (userId) =>
  Project.find({ user: userId, isPublished: true }).countDocuments();

exports.createProject = async (fields) => {
  const project = await Project.create(fields);
  return project;
};

exports.getBilling = async (userId) =>
  Billing.findOne({ user: userId, isActive: true }).lean();
