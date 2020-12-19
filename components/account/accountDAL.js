const Project = require('../../models/Project');
const Billing = require('../../models/Billing');
const User = require('../../models/User');

exports.deleteProjectsByUserId = async (userId) =>
  Project.deleteMany({ user: userId });

exports.deleteBillingByUserId = async (userId) =>
  Billing.deleteMany({ user: userId });

exports.getPostIds = async (userId) => Project.find({ user: userId }).lean();
