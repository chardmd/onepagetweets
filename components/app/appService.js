/* eslint-disable prettier/prettier */
const exphbs = require('express-handlebars');
const hbsHelpers = require('handlebars-helpers')();

const hbs = exphbs.create({
  extname: '.hbs',
  layoutsDir: 'components/app/client/layouts',
  partialsDir: ['components/app/client/partials'],
  helpers: {
    ...hbsHelpers,
    section: function section(name, options) {
      // setup page specific meta, links, and scripts
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

module.exports = hbs;
