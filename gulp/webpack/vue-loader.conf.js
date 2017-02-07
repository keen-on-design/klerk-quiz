'use strict';

const isProduction = process.env.NODE_ENV === 'production';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
let config = {};
if (isProduction) {
  config = {
    loaders: {
      sass: ExtractTextPlugin.extract({
        loader: [{
          loader: 'css-loader',
          options: {
            modules: true
          }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [
                require('autoprefixer'),
                require('css')
              ];
            }
          }
        }, {
          loader: 'sass-loader',
        }],
        includePaths: [
          require('node-bourbon').includePaths
        ],
        fallbackLoader: 'vue-style-loader'
      })
    }
  }
} else {
  config = {
    loaders: {
      scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
      sass: 'vue-style-loader!css-loader!sass-loader' // <style lang="sass">
    }
  }
}

module.exports = config;
