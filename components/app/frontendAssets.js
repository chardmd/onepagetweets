const express = require('express');
const path = require('path');

const jsLibraries = [
  express.static(path.join(__dirname, '..', '..', 'node_modules/jquery/dist'), {
    maxAge: 31557600000
  }),
  express.static(
    path.join(__dirname, '..', '..', 'node_modules/turbolinks/dist'),
    {
      maxAge: 31557600000
    }
  ),
  express.static(
    path.join(__dirname, '..', '..', 'node_modules/popper.js/dist/umd'),
    {
      maxAge: 31557600000
    }
  ),
  express.static(
    path.join(__dirname, '..', '..', 'node_modules/bootstrap/dist/js'),
    {
      maxAge: 31557600000
    }
  ),
  express.static(
    path.join(__dirname, '..', '..', 'node_modules/jquery.easing'),
    {
      maxAge: 31557600000
    }
  ),
  express.static(
    path.join(__dirname, '..', '..', 'node_modules/parsleyjs/dist'),
    {
      maxAge: 31557600000
    }
  ),
  express.static(path.join(__dirname, '..', '..', 'node_modules/sharer.js'), {
    maxAge: 31557600000
  }),
  express.static(
    path.join(__dirname, '..', '..', 'node_modules/@yaireo/tagify/dist'),
    {
      maxAge: 31557600000
    }
  ),
  express.static(
    path.join(__dirname, '..', '..', 'node_modules/clipboard/dist'),
    {
      maxAge: 31557600000
    }
  )
];

const cssLibraries = [
  express.static(
    path.join(
      __dirname,
      '..',
      '..',
      'node_modules/@fortawesome/fontawesome-free'
    ),
    {
      maxAge: 31557600000
    }
  )
];

module.exports = {
  jsLibraries,
  cssLibraries
};
