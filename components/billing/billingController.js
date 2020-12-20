/* eslint-disable camelcase */
/**
 * GET /billing
 * Contact form page.
 */
require('dotenv').config();
const _ = require('lodash');
const BillingService = require('./billingService');
const BillingDAL = require('./billingDAL');

exports.getBilling = async (req, res) => {
  res.render(`billing/client/billing-form`, {
    title: 'Billing Details',
    stripePublicKey: process.env.STRIPE_PKEY,
    stripePlanId: process.env.PLAN_ID
  });
};

exports.getSuccess = async (req, res) => {
  const { user } = req;
  const { sessionId } = req.query;
  const validationErrors = [];
  try {
    const session = await BillingService.getStripeSession(sessionId);
    const {
      currency,
      customer,
      payment_status,
      subscription: subscriptionId,
      amount_total
    } = session;
    const billing = await BillingDAL.getBillingByUserId(user._id);
    if (_.isNil(billing)) {
      const paymentObject = {
        customer,
        amount_total,
        payment_status,
        currency,
        subscriptionId,
        sessionId
      };
      await BillingDAL.saveBilling({ paymentObject, user });
    }
    res.render('billing/client/success', {
      title: 'Billing Success'
    });
  } catch (err) {
    console.log({ err });
    validationErrors.push({
      msg: 'Error loading page.'
    });
    req.flash('errors', validationErrors);
    return res.redirect(`/`);
  }
};

/**
 * It is important to enable the automatic email receipt for successful payment
 * https://dashboard.stripe.com/settings/emails
 */
exports.createCheckoutSession = async (req, res) => {
  const session = await BillingService.createStripeSession();
  res.send({
    sessionId: session.id
  });
};
