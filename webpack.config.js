var webpack = require('webpack'),
    path = require('path')

module.exports = {
  entry: [
    './app/index.js'
  ],
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  output: {
    path: __dirname + '/dist',
    filename: "index.js"
  },
  module: {
    devtool: "source-map", // or "inline-source-map"
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
    ]
  },
  plugins: [
    ProvidePlugin,
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('development')
        }
    })
  ]
}