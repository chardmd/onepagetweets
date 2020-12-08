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
