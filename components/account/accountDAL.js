const Project = require('../../models/Project');
const Billing = require('../../models/Billing');

exports.deleteProjectsByUserId = async (userId) =>
  Project.deleteMany({ user: userId });

exports.deleteBillingByUserId = async (userId) =>
  Billing.deleteMany({ user: userId });
