const Twitter = require('twitter-lite');

const uploadToTwitter = async (user, b64content) => {
  const { tokens } = user;
  const twitterToken = tokens.find(i => i.kind === 'twitter');
  const uploadClient = new Twitter({
    subdomain: 'upload',
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: twitterToken.accessToken,
    access_token_secret: twitterToken.tokenSecret
  });

  const client = new Twitter({
    subdomain: 'api',
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token_key: twitterToken.accessToken,
    access_token_secret: twitterToken.tokenSecret
  });

  const result = await uploadClient.post('media/upload', {
    media: b64content
  });
  var mediaIdStr = result.media_id_string;
  var altText = 'Small flowers in a planter on a sunny balcony, blossoming.';
  await uploadClient.post('media/metadata/create', {
    media_id: mediaIdStr,
    alt_text: { text: altText }
  });
  const params = {
    status: 'loving life #nofilter',
    media_ids: [mediaIdStr]
  };
  await client.post('statuses/update', params);
};

module.exports = {
  uploadToTwitter
};
