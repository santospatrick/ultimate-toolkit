var path    = require('path');
var webpack = require('webpack');

/* Working Directory */
var src = './source/scripts/';

module.exports = {
  entry: {
    home: src + 'home.js'
  },
  output: {
    path: path.join(__dirname, 'public/scripts'),
    filename: '[name].min.js'
  },
  resolve: {
    extensions: ['', '.js', '.json', '.coffee']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.ProvidePlugin({
      jQuery: "jquery"
    })
  ]
}
