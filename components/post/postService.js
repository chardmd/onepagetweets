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

const uploadToTwitter = async (user, b64content) => {
  const { tokens } = user;
  const twitterToken = tokens.find(i => i.kind === 'twitter');
  const { accessToken, tokenSecret } = twitterToken;
  const uploadClient = newClient({
    subdomain: 'upload',
    accessToken,
    tokenSecret
  });
  const result = await uploadClient.post('media/upload', {
    media: b64content
  });
  const mediaIdStr = result.media_id_string;
  const apiClient = newClient({ accessToken, tokenSecret });
  await apiClient.post('statuses/update', { media_ids: [mediaIdStr] });
};

module.exports = {
  uploadToTwitter
};
