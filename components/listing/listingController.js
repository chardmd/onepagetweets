const ListingDAL = require('./listingDAL');
const ListingService = require('./listingService');

/**
 * GET /
 */
exports.getHome = async (req, res) => {
  const { user } = req;
  if (user) {
    const project = await ListingDAL.getProjectByUserId(user.id);
    const twitterPost = await ListingService.getTwitterPost(
      user,
      project.postIds
    );
    const postIds = result.map((i) => i.id_str);
    await ListingDAL.updateProjectPostIds(user.id, postIds);
    res.render('listing/client/home', {
      title: 'Home',
      twitterPost,
      projExist: project !== null,
      isPublished: project !== null ? project.isPublished : false,
      summary: project !== null ? project.summary : '',
      baseUrl: process.env.BASE_URL
    });
  } else {
    const { u } = req.query;

    const sampleAccounts = [
      {
        label: '@indiehackers',
        value: 'indiehackers'
      },
      {
        label: '@nasa',
        value: 'nasa'
      },
      {
        label: '@dhh',
        value: 'dhh'
      },
      {
        label: '@wesbos',
        value: 'wesbos'
      },
      {
        label: 'arianagrande',
        value: 'arianagrande'
      },
      {
        label: '@billgates',
        value: 'billgates'
      },
      {
        label: '@elonmusk',
        value: 'elonmusk'
      },
      {
        label: 'katyperry',
        value: 'katyperry'
      },
      {
        label: '@joerogan',
        value: 'joerogan'
      },
      {
        label: '@producthunt',
        value: 'producthunt'
      },
      {
        label: '@waitbutwhy',
        value: 'waitbutwhy'
      },
      {
        label: '@tferriss',
        value: 'tferriss'
      },
      {
        label: '@justinbieber',
        value: 'justinbieber'
      },
      {
        label: '@jimmyfallon',
        value: 'jimmyfallon'
      }
    ];

    // render landing page
    res.render('listing/client/landing', {
      title: 'Landing',
      layout: 'basic',
      username: u,
      sampleAccounts,
      displayFooter: true,
      baseUrl: process.env.BASE_URL
    });
  }
};

/**
 * GET /:username
 */
exports.getDetails = async (req, res) => {
  const { params } = req;
  const { username } = params;
  const project = await ListingDAL.getProjectByUserName(username);
  if (project) {
    res.render('listing/client/details', {
      title: 'Home',
      layout: 'basic',
      username,
      summary: project !== null ? project.summary : '',
      baseUrl: process.env.BASE_URL
    });
  } else {
    res.render('listing/client/404', {
      title: 'Not Found',
      baseUrl: process.env.BASE_URL
    });
  }
};
