var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
        template: path.join(__dirname, '/app/index.html'),
        filename: 'index.html',
        inject: 'body'
    }),
    PHASER_DIR = path.join(__dirname, '/node_modules/phaser')

module.exports = {
  entry: [
    './app/index.js'
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: "index.js"
  },
  resolve: {
    alias: {
        'phaser': path.join(PHASER_DIR, 'build/custom/phaser-split.js'),
        'pixi': path.join(PHASER_DIR, 'build/custom/pixi.js'),
        'p2': path.join(PHASER_DIR, 'build/custom/p2.js')

    }
},
  module: {
    devtool: "source-map", // or "inline-source-map"
    loaders: [
    	{ test: /pixi\.js/, loader: "expose-loader?$!expose-loader?PIXI" },
            { test: /phaser-split\.js$/, loader: "expose-loader?$!expose-loader?Phaser" },
            { test: /p2\.js/, loader: "expose-loader?$!expose-loader?p2" },
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
  	HTMLWebpackPluginConfig
  ]
}