const Twitter = require('twitter-lite');
const Project = require('../../models/Project');

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
  const twitterToken = tokens.find((i) => i.kind === 'twitter');
  const { accessToken, tokenSecret } = twitterToken;
  const apiClient = newClient({ accessToken, tokenSecret });
  let ids = postIds.reduce((acc, item) => acc.concat(item).concat(','), '');
  ids = ids.substring(0, ids.length - 1);
  const result = await apiClient.get('statuses/lookup', { id: ids });

  await Project.findOneAndUpdate(
    {
      user: user.id
    },
    { postIds: result.map((i) => i.id_str) },
    {
      upsert: true
    }
  );
  return result;
};

module.exports = {
  getTwitterPost
};
