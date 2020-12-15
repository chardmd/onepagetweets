/* eslint-disable camelcase */
/**
 * GET /billing
 * Contact form page.
 */
require('dotenv').config();
const BillingService = require('./billingService');
const BillingDAL = require('./billingDAL');

exports.getBilling = async (req, res) => {
  const { projectId } = req.params;
  const project = await BillingDAL.getProjectById(projectId);
  res.render(`billing/client/billing-form`, {
    title: 'API Examples',
    stripePublicKey: process.env.STRIPE_PKEY,
    stripePlanId: process.env.PLAN_ID,
    projectId,
    project: {
      projectName: project.projectName
    }
  });
};

exports.getSuccess = async (req, res) => {
  const { user } = req;
  const { sessionId } = req.query;
  const session = await BillingService.getStripeSession(sessionId);
  const {
    payment_intent,
    metadata: { projectId }
  } = session;
  const project = await BillingDAL.getProjectById(projectId);

  if (!project.billing) {
    const paymentObject = await BillingService.getStripePaymentIntent(
      payment_intent
    );
    const billing = await BillingDAL.saveBilling({
      paymentObject,
      project,
      user
    });
    await BillingDAL.updateProjectBilling(projectId, billing);
  }

  res.render('billing/client/success', {
    title: 'Billing Success',
    projectName: project.projectName
  });
};

/**
 * It is important to enable the automatic email receipt for successful payment
 * https://dashboard.stripe.com/settings/emails
 */
exports.createCheckoutSession = async (req, res) => {
  const { projectId } = req.params;
  const project = await BillingDAL.getProjectById(projectId);
  const session = await BillingService.createStripeSession(project);
  res.send({
    sessionId: session.id
  });
};
