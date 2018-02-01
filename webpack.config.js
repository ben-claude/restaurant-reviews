const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
//
const config = {
  entry: {
    index: './js/index.js',
    restaurant: './js/restaurant.js',
    sw: './js/sw.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-bundle.js',
  },
  // webpack-dev-server config
  /*
  devServer: {
    headers: {
      // instruct the browser to cache the response for 3600 seconds
      'Cache-Control': 'max-age=3600',
    },
  },
  */
  //
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
      },
      {
        loader: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader' }
          ],
        }),
        test: /\.css$/,
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name]-style.css'),
    new HtmlWebpackPlugin({
      inject: false,
      template: 'index.html',
      filename: 'index.html',
      chunks: [ 'index' ],
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: 'restaurant.html',
      filename: 'restaurant.html',
      chunks: [ 'restaurant' ],
    }),
    new CopyWebpackPlugin([
      { from: 'img', to: 'img' },
      { from: 'data', to: 'data' },
      { from: 'README.md', to: 'README.md' },
    ]),
  ],
};
//
module.exports = config;

