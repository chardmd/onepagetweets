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
      layout: 'basic',
      username: u,
      sampleAccounts: HomeConstants.sampleAccounts,
      baseUrl: process.env.BASE_URL
    });
  }
};
