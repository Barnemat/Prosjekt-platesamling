const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src');

const config = {
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
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=5000&name=[path][name].[hash:6].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    contentBase: path.join(__dirname,"dist"),
    compress: true,
    historyApiFallback: true,
    port: 9000
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
