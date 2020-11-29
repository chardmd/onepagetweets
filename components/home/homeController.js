const HomeDAL = require('./homeDAL');
const HomeService = require('./homeService');
const HomeConstants = require('./homeConstants');

/**
 * GET /
 */
exports.getHome = async (req, res) => {
  const { user } = req;
  if (user) {
    const project = await HomeDAL.getProjectByUserId(user.id);
    const twitterPost =
      project && (await HomeService.getTwitterPost(user, project.postIds));
    const twitterPostIds = twitterPost ? twitterPost.map((i) => i.id_str) : [];
    await HomeDAL.updateProjectPostIds(user.id, twitterPostIds);
    res.render('home/client/home', {
      title: 'Home',
      twitterPost,
      projExist: project !== null,
      isPublished: project !== null ? project.isPublished : false,
      summary: project !== null ? project.summary : '',
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
      displayFooter: false,
      baseUrl: process.env.BASE_URL
    });
  }
};
