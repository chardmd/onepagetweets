const moment = require('moment');
const Project = require('../../models/Project');
const Billing = require('../../models/Billing');

exports.getProjectById = async projectId => Project.findById(projectId);

exports.saveBilling = async ({ paymentObject, project, user }) => {
  const billing = new Billing({
    customer: paymentObject.customer,
    amount: paymentObject.amount,
    status: paymentObject.status,
    created: moment.unix(paymentObject.created),
    paymentMethod: paymentObject.payment_method,
    project: project.projectId,
    user: user.id
  });
  billing.save();
  return billing;
};

exports.updateProjectBilling = async (projectId, billing) => {
  return Project.findByIdAndUpdate(projectId, {
    billing
  });
};
