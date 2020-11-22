const Twit = require('twit');

const uploadToTwitter = async b64content => {
  var T = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_TOKEN_SECRET,
    timeout_ms: 80 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: false // optional - requires SSL certificates to be valid.
  });

  // first we must post the media to Twitter
  T.post('media/upload', { media_data: b64content }, function(
    err,
    data,
    response
  ) {
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string;
    var altText = 'Small flowers in a planter on a sunny balcony, blossoming.';
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

    T.post('media/metadata/create', meta_params, function(err, data, response) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        var params = {
          status: 'loving life #nofilter',
          media_ids: [mediaIdStr]
        };

        T.post('statuses/update', params, function(err, data, response) {
          console.log(data);
        });
      }
    });
  });
  //test
};

module.exports = {
  uploadToTwitter
};
