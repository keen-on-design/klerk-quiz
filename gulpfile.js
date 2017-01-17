'use strict';

var plugins = require('gulp-load-plugins')({
    DEBUG: false
});

//noinspection JSDuplicatedDeclaration,JSUnresolvedVariable
global.$ = {
    package: require('./package.json'),
    config: require('./gulp/config'),

    releaseFlag  : require('gulp-util').env[require('./gulp/config').app.environment.releaseFlag] !== undefined,

    path: {
        task: [
            './gulp/c.tasks/clean.js',
            './gulp/c.tasks/sass.js',
            './gulp/c.tasks/fonts.js',
            './gulp/custom/html.build.js',
            './gulp/c.tasks/scripts.js',
            './gulp/c.tasks/images.js',
            './gulp/c.tasks/svg.js',
            './gulp/c.tasks/serve.js',
            './gulp/c.tasks/favicon.js',
            './gulp/c.tasks/deploy.js'
        ]
    },

    gulp        : require('gulp'),
    rimraf      : require('rimraf'),
    del         : require('del'),
    vinylPaths  : require('vinyl-paths'),
    fs          : {
        utils: require('fs-utils'),
        exists: require('file-exists')
    },
    console     : require('gulp-util'),
    plugins     : plugins,
    browserSync : require('browser-sync').create(),
    ftp         : require('vinyl-ftp'),
    argv        : require('yargs').argv
};

$.path.task.forEach(function (taskPath) {
    require(taskPath)();
});

$.gulp.task('watch', function () {
    $.gulp.watch($.config.js.location, $.gulp.series('js:app'));
    $.gulp.watch($.config.sass.location, $.gulp.series('sass:process'));
    $.gulp.watch($.config.html.location, $.gulp.series('html:build'));
    $.gulp.watch($.config.fonts.location, $.gulp.series('fonts'));
    $.gulp.watch($.config.svg.location, $.gulp.series('svg:sprite'));
    $.gulp.watch($.config.images.location, $.gulp.series('images:process'));
});

$.gulp.task('deploy', $.gulp.series(
    'ftp:deploy'
));

$.gulp.task('build', $.gulp.series(
    ($.releaseFlag ? 'clean:release' : 'clean:dev'),
    $.gulp.parallel(
        'images:process',
        'svg:sprite',
        'fonts',
        'sass:process',
        'html:build',
        'js:bundle',
        'js:app'
    ),
    $.gulp.parallel(
        'watch',
        'serve'
    )
));

$.gulp.task('default', $.gulp.series(
    'build'
));