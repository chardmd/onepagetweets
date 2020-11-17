const ListingDAL = require('./listingDAL');

/**
 * GET /
 */
exports.getHome = async (req, res) => {
  const { user } = req;
  if (user) {
    const project = await ListingDAL.getProjectByUserId(user.id);
    res.render('listing/client/home', {
      title: 'Home',
      projExist: project !== null,
      isPublished: project !== null ? project.isPublished : false,
      headline: project !== null ? project.headline : '',
      fullName: project !== null ? project.fullName : '',
      summary: project !== null ? project.summary : '',
      techStack: project !== null ? project.techStack : [],
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
      headline: project !== null ? project.headline : '',
      fullName: project !== null ? project.fullName : '',
      summary: project !== null ? project.summary : '',
      techStack: project !== null ? project.techStack : [],
      baseUrl: process.env.BASE_URL
    });
  } else {
    res.render('listing/client/404', {
      title: 'Not Found',
      baseUrl: process.env.BASE_URL
    });
  }
};
