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
            './gulp/c.tasks/pug.js',
            './gulp/c.tasks/scripts.js',
            './gulp/c.tasks/images.js',
            './gulp/c.tasks/svg.js',
            './gulp/c.tasks/serve.js',
            './gulp/c.tasks/watch.js',
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
        'pug:process',
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