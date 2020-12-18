/* eslint-disable camelcase */
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SKEY);

exports.getSubscription = async (subscriptionId) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
};

exports.createStripeSession = async () => {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: process.env.STRIPE_PAYMENT_METHODS.split(', '),
    billing_address_collection: 'auto',
    locale: 'en',
    line_items: [
      {
        quantity: 1,
        description: 'Design and personalize your tweets',
        price: process.env.STRIPE_SUBSCRIPTION_ID //configurable via stripe under Products => Pricing
      }
    ],
    success_url: `${process.env.BASE_URL}/billing/success?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/billing`
  });

  return session;
};

exports.getStripeSession = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    maxNetworkRetries: 2 // Retry this specific request twice before giving up
  });
  return session;
};

exports.getStripePaymentIntent = async (paymentIntent) =>
  stripe.paymentIntents.retrieve(paymentIntent);
