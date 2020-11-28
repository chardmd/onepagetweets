/* eslint-disable prettier/prettier */
const exphbs = require('express-handlebars');
const hbsHelpers = require('handlebars-helpers')();

const hbs = exphbs.create({
  extname: '.hbs',
  layoutsDir: 'components/app/layouts',
  partialsDir: ['components/app/partials'],
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
