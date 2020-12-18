const _ = require('lodash');
const HomeDAL = require('./homeDAL');
const HomeService = require('./homeService');
const HomeConstants = require('./homeConstants');

/**
 * GET /
 */
exports.getHome = async (req, res) => {
  const { user } = req;
  if (user) {
    let projects = await HomeDAL.getProjects(user.id);
    const postIds = projects.map((i) => i.postId);
    const twitterPost = await HomeService.getTwitterPost(user, postIds);
    const activePostIds = twitterPost.map((i) => i.id_str);
    //we will get those ids that were deleted in the twitter profile
    const deletedPostIds = _.difference(postIds, activePostIds);
    if (deletedPostIds.length > 0) {
      await HomeDAL.deleteProjectsByIds(deletedPostIds);
    }
    res.render('home/client/home', {
      title: 'Home',
      twitterPost,
      baseUrl: process.env.BASE_URL
    });
  } else {
    const { u } = req.query;
    // render landing page
    res.render('home/client/landing', {
      title: 'Landing',
      layout: 'landing',
      username: u,
      sampleAccounts: HomeConstants.sampleAccounts,
      baseUrl: process.env.BASE_URL
    });
  }
};

/**
 * POST /home/create
 */
exports.postCreate = async (req, res) => {
  const validationErrors = [];
  try {
    //check if the total projects of the customer
    const totalProjectCount = await HomeDAL.countProjectTotal(req.user.id);
    //check if the customer has subscribe to the service
    const billing = await HomeDAL.getBillingByUserId(req.user._id);
    const subscription =
      !_.isNil(billing) &&
      (await HomeService.getSubscription(billing.subscriptionId));
    /**
     * we allow the creation of project if:
     * 1) the customer has less than 3 projects
     * 2) Or the customer subscribe to our service
     */
    if (
      totalProjectCount < parseInt(process.env.MAX_PROJECT_COUNT, 10) ||
      (!_.isNil(subscription) &&
        subscription.status === HomeConstants.paymentStatus.ACTIVE)
    ) {
      const unpublishedProject = await HomeDAL.getProjectByUserId(req.user.id);
      if (_.isNil(unpublishedProject)) {
        await HomeDAL.createProject({
          user: req.user.id,
          content: '',
          bgColor: '#eff6fb' //set default color
        });
      }
      return res.redirect(`/draft/editor`);
    } else {
      //customer needs to pay
      return res.redirect(`/billing`);
    }
  } catch (err) {
    console.log({ err });
    validationErrors.push({
      msg: 'Error creating project. Please try again.'
    });
    req.flash('errors', validationErrors);
    return res.redirect(`/`);
  }
};
