/**
 * GET /terms-of-service
 */
exports.getTermsOfService = (req, res) => {
  res.render('policy/client/terms-of-service', {
    title: 'Terms of Service'
  });
};

/**
 * GET /privacy
 */
exports.getPrivacy = (req, res) => {
  res.render('policy/client/privacy', {
    title: 'Privacy'
  });
};

/**
 * GET /privacy
 */
exports.getContact = (req, res) => {
  res.render('policy/client/contact', {
    title: 'Contact'
  });
};
