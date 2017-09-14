var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    BitBarWebpackProgressPlugin = require("bitbar-webpack-progress-plugin")
    HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
        template: path.join(__dirname, '/app/index.html'),
        filename: 'index.html',
        inject: 'body'
    })

module.exports = {
  entry: [
    './app/index.js'
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: "index.js"
  },
  module: {
    devtool: "source-map", // or "inline-source-map"
    loaders: [
    {
      loader: 'script',// script-loader
      test: /(pixi|phaser).js/
    },
    {
        test: /\.js$/,
        exclude: [/node_modules/],
        include: [path.resolve(__dirname, 'app')],
        loader: "babel-loader",
        query: {
            presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.jpg|.jpeg|.png|.gif|.svg$/,
        loader: "file?name=app/assets/[name].[ext]"
      },
      {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'file?name=fonts/[name].[ext]'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    HTMLWebpackPluginConfig,
    BitBarWebpackProgressPlugin
  ]
}