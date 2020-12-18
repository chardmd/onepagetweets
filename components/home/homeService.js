require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SKEY);
const Twitter = require('twitter-lite');

const getTwitterPost = async (user, postIds) => {
  const { tokens } = user;
  const twitterToken = tokens.find((i) => i.kind === 'twitter');
  const { accessToken, tokenSecret } = twitterToken;
  const client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: accessToken,
    access_token_secret: tokenSecret
  });
  let ids = postIds.reduce((acc, item) => acc.concat(item).concat(','), '');
  ids = ids.substring(0, ids.length - 1);
  const result = await client.get('statuses/lookup', { id: ids });
  return result;
};

const getSubscription = async (subscriptionId) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
};

module.exports = {
  getTwitterPost,
  getSubscription
};
