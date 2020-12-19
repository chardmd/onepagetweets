const _ = require('lodash');
const User = require('../../models/User');
const AccountDAL = require('./accountDAL');
const AccountService = require('./accountService');
/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
  const { user } = req;

  res.render('account/client/account', {
    title: 'Account Management',
    email: user.email,
    name: user.profile.name,
    gender: user.profile.gender,
    location: user.profile.location,
    website: user.profile.website
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = async (req, res, next) => {
  try {
    const result = await AccountDAL.getPostIds(req.user._id);
    const toDeletePromise = result.map(async (item) => {
      await AccountService.deleteTwitterPost(req.user, item.postId);
    });
    await Promise.all(toDeletePromise);
    await User.deleteOne({ _id: req.user.id });
    await AccountDAL.deleteProjectsByUserId(req.user.id);
    await AccountDAL.deleteBillingByUserId(req.user.id);
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
  req.logout();
  req.flash('info', {
    msg: 'Your account has been deleted.'
  });
  res.redirect('/');
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const { provider } = req.params;
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    user[provider.toLowerCase()] = undefined;
    const tokensWithoutProviderToUnlink = user.tokens.filter(
      (token) => token.kind !== provider.toLowerCase()
    );
    // Some auth providers do not provide an email address in the user profile.
    // As a result, we need to verify that unlinking the provider is safe by ensuring
    // that another login method exists.
    if (
      !(user.email && user.password) &&
      tokensWithoutProviderToUnlink.length === 0
    ) {
      req.flash('errors', {
        msg:
          `The ${_.startCase(
            _.toLower(provider)
          )} account cannot be unlinked without another form of login enabled.` +
          ' Please link another account or add an email address and password.'
      });
      return res.redirect('/account');
    }
    user.tokens = tokensWithoutProviderToUnlink;
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('info', {
        msg: `${_.startCase(_.toLower(provider))} account has been unlinked.`
      });
      res.redirect('/account');
    });
  });
};
