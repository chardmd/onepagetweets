const Twitter = require('twitter-lite');
const LZString = require('lz-string');

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
  const twitterToken = tokens.find((i) => i.kind === 'twitter');
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
  const { id_str } = await apiClient.post('statuses/update', {
    media_ids: [mediaIdStr]
  });
  return id_str;
};

const decompressPayload = (data) => {
  let out = '';
  for (let i = 0; i < data.length; i += 2) {
    let charCode = data.charCodeAt(i) * 256;
    charCode += data.charCodeAt(i + 1);
    out += String.fromCharCode(charCode);
  }
  const decompressData = LZString.decompress(out);
  return decompressData;
};

module.exports = {
  uploadToTwitter,
  decompressPayload
};
