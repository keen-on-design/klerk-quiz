'use strict';
var path = require('./config.paths');

module.exports = {

    root    : path.root,
    src     : path.src,
    destDev : path.destDev,
    destRls : path.destRls,

    app : {
        favicon : {
            location    : path.src + 'favicon/master.png',
            destination : path.src + 'favicon/',
            dataFile    : path.root + 'favicon.json',
            basedir     : '/',
            template    : '_favicon.pug',
            config      : require('./config.favicon.js')
        },
        deploy : require('./config.deploy.js'),
        environment : require('./config.environment.js')
    },

    sass: {
        location       : path.src + 'scss/**/*.scss',
        entryPoint     : path.src + 'scss/style.scss',
        destinationDev : path.destDev + 'css',
        destinationRls : path.destRls + 'css',

        config: {
            outputStyle: 'nested',
            autoprefixer: {
                browser: [
                    'last 3 version', '> 1%', 'ie 8', 'ie 9', 'Opera 12.1'
                ]
            },
            rls : {
                outputStyle: 'compressed',
                autoprefixer: {
                    browser: [
                        'last 3 version', '> 1%', 'ie 8', 'ie 9', 'Opera 12.1'
                    ]
                }
            }
        }
    },

    pug: {
        location       : path.src + 'template/**/*.pug',
        compiled       : path.src + 'template/_pages/*.pug',
        destinationDev : path.destDev,
        destinationRls : path.destRls,
        externals      : path.src + 'template/_external/',
        dummy          : path.src + 'template/_external/_dummy.pug',

        config: {
            pretty: '\t',
            basedir: path.root
        }

    },

    js : {
        location       : path.src + 'js/**/*.js',
        entryPoint     : path.src + 'js/main.js',
        destinationDev : path.destDev + 'js',
        destinationRls : path.destRls + 'js',

        app: {
            result: 'app.min.js',
            browserify: {
                insertGlobals: true,
                debug: true
            }
        },
        bundle: {
            result  : 'bundle.min.js',
            vendors : require('./config.bundle.js')
        }
    },

    fonts : {
        location       : path.src + 'fonts/**/*.{ttf,woff,woff2,eof,svg}',
        destinationDev : path.destDev + 'fonts',
        destinationRls : path.destRls + 'fonts'
    },

    images : {
        location       : path.src + 'images/**/*',
        destinationDev : path.destDev + 'images',
        destinationRls : path.destRls + 'images',

        config: {
            imagemin: {
                optimizationLevel: 5,
                progressive: true,
                interlaced: true
            }
        }
    },

    svg: {
        location       : path.src + 'svg/**/*.svg',
        destinationDev : path.destDev + 'svg',
        destinationRls : path.destRls + 'svg',

        config: {
            sprite: {
                svgmin: {
                    js2svg: {
                        pretty: true
                    }
                },
                cheerio: {
                    run: function ($) {
                        $('[fill]').removeAttr('fill');
                        $('[style]').removeAttr('style');
                    },
                    parserOptions: {
                        xmlMode: true
                    }
                },
                svgSprite: {
                    mode: {
                        symbol: {
                            example: false
                        }
                    }
                }
            }
        }
    },

};