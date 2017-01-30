'use strict';
module.exports = {
  // configure a built-in compiler
  sass: {
    includePaths: require('node-bourbon').includePaths
  },
  babel: {
    "presets": ["es2015", "stage-2"],
    "plugins": ["transform-runtime"],
    "comments": false
  },
  // provide your own postcss plugins
  postcss: [],
  // register custom compilers
  customCompilers: {}
}