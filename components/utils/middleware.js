const pako = require('pako');

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    const { user } = req;
    if (user.isAdmin) {
      return next();
    }
  }
  res.redirect('/');
};

exports.parsePako = (req, res, next) => {
  try {
    const { body } = req;
    if (typeof body === 'string') {
      req.body = JSON.parse(pako.inflate(body, { to: 'string' }));
    }
  } catch (e) {
    next(e);
  }
  next();
};
