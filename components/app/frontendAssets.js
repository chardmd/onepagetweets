const express = require('express');
const path = require('path');

const librariesPath = [
  'node_modules/jquery/dist',
  'node_modules/turbolinks/dist',
  'node_modules/popper.js/dist/umd',
  'node_modules/bootstrap/dist/js',
  'node_modules/jquery.easing',
  'node_modules/clipboard/dist',
  'node_modules/html2canvas/dist',
  'node_modules/@fortawesome/fontawesome-free',
  'node_modules/quill/dist',
  'node_modules/lz-string/libs'
];

const jsLibraries = librariesPath.map((value) =>
  express.static(path.join(__dirname, '..', '..', value), {
    maxAge: 31557600000
  })
);

module.exports = jsLibraries;
