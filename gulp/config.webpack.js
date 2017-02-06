'use strict';

const path = require('path');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const pathToBourbon = require('node-bourbon').includePaths;
const productionEnv = process.env.NODE_ENV === 'production';

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

let config = {
  entry: {
    app: './src/js/main.js'
  },
  output: {
    path: path.join(__dirname, './build/js/'),
    filename: '[name].js',
    publicPath: '/'
  },
  performance: {
    hints: productionEnv ? 'warning' : false
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      'src': resolve('src/js'),
      'assets': resolve('src/js/modules'),
      'components': resolve('src/js/components')
    }
},
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [resolve('src')],
        options: {
          //formatter: eslintFriendlyFormatter
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options:
        {
          loaders: {
            sass: ExtractTextPlugin.extract({
              loader: [
                {
                  loader: 'css-loader',
                  options: {
                    modules: true
                  }
                },
                /*{
                  loader: 'postcss-loader',
                  options: {
                    plugins: function () {
                      return [
                        require('autoprefixer')
                      ];
                    }
                  }
                },*/
                {
                  loader: 'sass-loader',
                  options: {
                    includePaths: pathToBourbon
                  }
                }
              ],
              fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
            })
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new ProgressPlugin()
  ],
};

if (productionEnv) {
  // use [chunkhash:8] filename to support long-term caching
  config.output.filename = 'js/[name].js';

  config.plugins.push(
    new ExtractTextPlugin('css/bundle.css'),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    })
  );
}

module.exports = config;