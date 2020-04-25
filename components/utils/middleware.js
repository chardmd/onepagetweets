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
