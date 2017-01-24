'use strict';

module.exports = function () {

  //Compiles pug templates
  $.gulp.task('html:build', function () {
    return $.gulp.src($.config.html.location)
      .pipe($.plugins.plumber())
      .pipe($.plugins.useref())
      .pipe($.plugins.if('*.js',
        $.plugins.if($.argv.release, $.plugins.uglify())
      ))
      .pipe($.plugins.if('*.css',
        $.plugins.if($.argv.release, $.plugins.cssnano())
      ))
      .pipe($.plugins.if($.argv.release,
        $.gulp.dest($.config.pug.destinationRls)
      ))
      .pipe($.plugins.if($.argv.release === undefined,
        $.gulp.dest($.config.pug.destinationDev)
      ));
  });
};