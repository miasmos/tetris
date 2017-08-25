var webpack = require('webpack'),
    path = require('path'),
    WebpackStripLoader = require('strip-loader'),
    stripLoader = {
     test: [/\.js$/, /\.es6$/],
     exclude: /node_modules/,
     loader: WebpackStripLoader.loader('console.log')
    }

module.exports = {
  entry: [
    './app/index.js'
  ],
  loaders: [
    stripLoader
  ],
  output: {
    path: __dirname + '/dist',
    filename: "index.js"
  },
  module: {
    loaders: [
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
    ],
    sassLoader: {
      includePaths: [path.resolve(__dirname, "./app/index.scss")]
    }
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    })
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
  ]
};