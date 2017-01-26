'use strict';

let path = require('./config.paths');

module.exports = {
  destination: '/public_html/',

  files: [
    path.destPrd + 'css/**',
    path.destPrd + 'js/**',
    path.destPrd + 'fonts/**',
    path.destPrd + 'images/**',
    path.destPrd + 'svg/**',
    path.destPrd + 'api/**',
    path.destPrd + '*.*'
  ],

  connect: {
    host: 'HOMESTEAD',
    user: 'USERNAME',
    password: 'SECRET',
    parallel: 10,
    log: require('gulp-util').log,
  },

  ftp: {
    base: path.destPrd,
    buffer: false
  }
};