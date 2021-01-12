const path = require('path');
const webpack = require('webpack');

const mode = process.env.NODE_ENV;

module.exports = {
  mode: mode,
  devtool: mode == 'development' ? 'cheap-module-eval-source-map' : false,
  entry: './entry.js',
  output: {
    path: path.resolve(__dirname, mode == 'development' ? 'dist' : '../dist'),
    filename: `evaluatly.js`,
    library: 'Evaluatly',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: [".js", ".scss"],
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.scss$/i,
        use: [
          'extract-loader',
          'raw-loader',
          'css-loader',
          'sass-loader'
        ],
      }
    ]
  }
}

