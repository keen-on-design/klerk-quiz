'use strict';
const path = require('path');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

function resolve (dir) {
  return path.join(__dirname, '../..', dir)
}

module.exports = {
  entry: {
    main: './src/js/main.js'
  },

  output: {
    path: path.join(__dirname, './build/js/'),
    filename: 'js/[name].js',
    chunkFilename: 'js/vendor.js',
    publicPath: '/'
  },

  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },

  resolve: {
    extensions: ['.js', '.vue', '.css', '.json'],
    alias: {
      //root: path.join(__dirname, '../src'),
      //components: path.join(__dirname, '../src/js/components'),
      //modules: path.join(__dirname, '../src/js/modules')
    },
    modules: [
      resolve('src/js/modules'),
      resolve('src/js/components'),
      resolve('node_modules'),
      resolve('node_modules/node-bourbon/node_modules/bourbon/app/assets/stylesheets/')
    ]
  },

  devServer: {
    historyApiFallback: true,
    noInfo: true
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: require('./vue-loader.conf')
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('src/js/modules')]
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
