const express = require('express');
const path = require('path');

const librariesPath = [
  'node_modules/jquery/dist',
  'node_modules/turbolinks/dist',
  'node_modules/popper.js/dist/umd',
  'node_modules/bootstrap/dist/js',
  'node_modules/jquery.easing',
  'node_modules/sharer.js',
  'node_modules/@yaireo/tagify/dist',
  'node_modules/clipboard/dist',
  'node_modules/html2canvas/dist',
  'node_modules/@fortawesome/fontawesome-free'
];

const jsLibraries = librariesPath.map(value =>
  express.static(path.join(__dirname, '..', '..', value), {
    maxAge: 31557600000
  })
);

module.exports = jsLibraries;
