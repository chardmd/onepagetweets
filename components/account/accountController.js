const _ = require('lodash');
const moment = require('moment');
const User = require('../../models/User');
const AccountDAL = require('./accountDAL');
const AccountService = require('./accountService');
/**
 * GET /account
 * Profile page.
 */
exports.getAccount = async (req, res) => {
  const billing = await AccountDAL.getBillingByUserId(req.user._id);
  res.render('account/client/account', {
    title: 'Account Management',
    hasBilling: !_.isNil(billing),
    cancelAt: !_.isNil(billing) && billing.cancelAt,
    amount: process.env.STRIPE_PRICE
  });
};

/**
 * PUT /account/cancel
 * Delete user account.
 */
exports.putCancelSubscription = async (req, res, next) => {
  try {
    //cancel any billing subscription by end of billing cycle
    const activeBilling = await AccountDAL.getBillingByUserId(req.user._id);
    const subscription =
      !_.isNil(activeBilling) &&
      (await AccountService.cancelSubscription(activeBilling.subscriptionId));

    await AccountDAL.updateBillingCancelDate(
      req.user.id,
      moment.unix(subscription.cancel_at)
    );
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
  req.flash('info', {
    msg: 'Your subscription has been cancelled.'
  });
  res.redirect('/account');
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = async (req, res, next) => {
  try {
    //delete posted tweets from this service
    const result = await AccountDAL.getPostIds(req.user._id);
    const toDeletePromise = result.map(async (item) => {
      await AccountService.deleteTwitterPost(req.user, item.postId);
    });
    await Promise.all(toDeletePromise);

    //cancel any billing subscription by end of billing cycle
    const activeBilling = await AccountDAL.getBillingByUserId(req.user._id);
    !_.isNil(activeBilling) &&
      (await AccountService.cancelSubscription(activeBilling.subscriptionId));

    //delete user
    await User.deleteOne({ _id: req.user.id });

    //delete projects
    await AccountDAL.deleteProjectsByUserId(req.user.id);

    //delete billing details
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
