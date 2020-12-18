const Project = require('../../models/Project');
const Billing = require('../../models/Billing');

exports.getProjects = async (userId) =>
  Project.find({ user: userId, isPublished: true })
    .sort({
      createdAt: -1
    })
    .lean();

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

exports.getProjectByUserId = async (userId) =>
  Project.findOne({ user: userId, isPublished: false }).lean();

exports.createProject = async (fields) => {
  const project = await Project.create(fields);
  return project;
};

exports.countProjectTotal = async (userId) =>
  Project.find({ user: userId, isPublished: true }).countDocuments();

exports.getBillingByUserId = async (userId) =>
  Billing.findOne({ user: userId, isActive: true }).lean();

exports.disabledBilling = async (userId) =>
  Billing.findOneAndUpdate(
    {
      user: userId,
      isActive: true
    },
    {
      isActive: false
    }
  );
