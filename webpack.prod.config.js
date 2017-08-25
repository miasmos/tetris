var webpack = require('webpack'),
    path = require('path'),
    WebpackStripLoader = require('strip-loader'),
    stripLoader = {
     test: [/\.js$/, /\.es6$/],
     exclude: /node_modules/,
     loader: WebpackStripLoader.loader('console.log')
    },
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
        template: __dirname + '/app/index.html',
        filename: 'index.html',
        inject: 'body'
    }),
    PHASER_DIR = path.join(__dirname, '/node_modules/phaser')

module.exports = {
  entry: [
    './app/index.js'
  ],
  loaders: [
    stripLoader
  ],
  alias: {
  	phaser: path.join(PHASER_DIR, 'build/custom/phaser-split.js'),
      pixi: path.join(PHASER_DIR, 'build/custom/pixi.js'),
      p2: path.join(PHASER_DIR, 'build/custom/p2.js'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: ['./src', 'node_modules'],
    alias: {
      phaser: path.join(PHASER_DIR, 'build/custom/phaser-split.js'),
      pixi: path.join(PHASER_DIR, 'build/custom/pixi.js'),
      p2: path.join(PHASER_DIR, 'build/custom/p2.js'),
    },
  },
  output: {
    path: __dirname + '/dist',
    filename: "index.js"
  },
  module: {
    loaders: [
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
        test: /pixi\.js/,
        use: [{
          loader: 'expose-loader',
          options: 'PIXI',
        }],
      },
      {
        test: /phaser-split\.js$/,
        use: [{
          loader: 'expose-loader',
          options: 'Phaser',
        }],
      },
      {
        test: /p2\.js/,
        use: [{
          loader: 'expose-loader',
          options: 'p2',
        }],
      },
      {
        test: /\.jpg|.jpeg|.png|.gif|.svg$/,
        loader: "file?name=images/[name].[ext]"
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
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
      mangle: false,
       output: {
          space_colon: false,
          comments: function(node, comment) {
              var text = comment.value;
              var type = comment.type;
              if (type == "comment2") {
                  // multiline comment
                  return /@copyright/i.test(text);
              }
          }
      }
    }),
    HTMLWebpackPluginConfig
  ]
};