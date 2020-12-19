require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SKEY);
const Twitter = require('twitter-lite');

const deleteTwitterPost = async (user, id) => {
  const { tokens } = user;
  const twitterToken = tokens.find((i) => i.kind === 'twitter');
  const { accessToken, tokenSecret } = twitterToken;
  const client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: accessToken,
    access_token_secret: tokenSecret
  });
  let result;
  try {
    result = await client.post(`statuses/destroy/${id}`);
  } catch (ex) {
    console.log(ex);
  }
  return result;
};

const cancelSubscription = async (subscriptionId) => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true
  });
  return subscription;
};

module.exports = {
  deleteTwitterPost,
  cancelSubscription
};
