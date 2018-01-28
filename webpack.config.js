var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.(js|jsx)$/,
        include : APP_DIR,
        loader : 'babel-loader'
      },
      {
        test : /\.css$/,
        include : APP_DIR,
        loader : 'style-loader!css-loader'
      },
      {
        test : /\.css$/,
        include : path.resolve(__dirname, 'node_modules'),
        loader : 'style-loader!css-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    contentBase: path.join(__dirname,"builddir"),
    compress: true,
    historyApiFallback: true,
    port: 9000,
    open: true
  },
  plugins : [
      new HtmlWebpackPlugin({
        title: "Prosjekt platesamling",
        template: "src/index.ejs",
        inject: false,
        chucksSortMode: 'dependency'
      })
  ]
};

module.exports = config;
