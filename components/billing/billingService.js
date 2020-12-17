/* eslint-disable camelcase */
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SKEY);

exports.createStripeSession = async () => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: process.env.STRIPE_PAYMENT_METHODS.split(', '),
    locale: 'en',
    line_items: [
      {
        name: `Publish Personal Tweets`,
        images: [process.env.STRIPE_PHOTO_URL],
        quantity: 1,
        description: 'Access all exclusive features for this project',
        currency: process.env.STRIPE_CURRENCY,
        amount: process.env.STRIPE_BASE_PRICE // Keep the amount on the server to prevent customers from manipulating on client
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
