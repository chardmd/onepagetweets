const Twitter = require('twitter-lite');

const newClient = ({ subdomain = 'api', accessToken, tokenSecret }) => {
  return new Twitter({
    subdomain,
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: accessToken,
    access_token_secret: tokenSecret
  });
};

const getTwitterPost = async (user, postIds) => {
  const { tokens } = user;
  const twitterToken = tokens.find(i => i.kind === 'twitter');
  const { accessToken, tokenSecret } = twitterToken;
  const apiClient = newClient({ accessToken, tokenSecret });
  let ids = postIds.reduce((acc, item) => acc.concat(item).concat(','), '');
  ids = ids.substring(0, ids.length - 1);
  const result = await apiClient.get('statuses/lookup', { id: ids });
  return result;
};

module.exports = {
  getTwitterPost
};
