const moment = require('moment');
const Billing = require('../../models/Billing');

exports.getBillingByUserId = async (userId) =>
  Billing.findOne({ user: userId, isActive: true }).lean();

exports.saveBilling = async ({ paymentObject, user }) => {
  const billing = new Billing({
    customer: paymentObject.customer,
    amount: paymentObject.amount_total,
    status: paymentObject.payment_status,
    currency: paymentObject.currency,
    paymentMethod: paymentObject.subscription,
    created: moment(new Date()),
    isActive: true,
    user: user.id
  });
  billing.save();
  return billing;
};
