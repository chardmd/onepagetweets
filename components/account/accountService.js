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
  const result = await client.post(`statuses/destroy/${id}`);
  return result;
};

module.exports = {
  deleteTwitterPost
};
