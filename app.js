/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const sass = require('node-sass-middleware');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const appRouter = require('./components/app/appRoutes');
const hbs = require('./components/app/appService');
const jsLibraries = require('./components/app/frontendAssets');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({
  path: '.env'
});

/**
 * Create Express server.
 */
const app = express();

/** initialise Sentry */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log(
    '%s MongoDB connection error. Please make sure MongoDB is running.',
    chalk.red('✗')
  );
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'components'));

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(
  sass({
    src: path.join(__dirname, 'public'),
    includePaths: ['components'],
    dest: path.join(__dirname, 'public')
  })
);
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
  })
);
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1209600000
    }, // two weeks in milliseconds
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      autoReconnect: true
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
require('./components/auth/passport'); // passport strategies

app.use(flash());
app.use((req, res, next) => {
  lusca.csrf()(req, res, next);
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use(async (req, res, next) => {
  if (req.user) {
    const user = {
      id: req.user.id,
      email: req.user.email,
      profile: req.user.profile,
      isAdmin: req.user.isAdmin,
      twitter: req.user.twitter
    };
    res.locals.user = user;
  }
  // set HOME_PAGE_URL
  res.locals.homePageUrl = process.env.HOME_PAGE_URL;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the home page
  if (
    !req.user &&
    req.path !== '/' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)
  ) {
    req.session.returnTo = '/';
  } else if (
    req.user &&
    (req.path === '/account' || req.path.match(/^\/api/))
  ) {
    req.session.returnTo = '/';
  }
  next();
});
app.use(
  '/',
  express.static(path.join(__dirname, 'public'), {
    maxAge: 31557600000
  })
);

//frontend assets
app.use('/js/lib', jsLibraries);

//  Connect all our routes to our application
app.use('/', appRouter);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(
    '%s App is running at http://localhost:%d in %s mode',
    chalk.green('✓'),
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
