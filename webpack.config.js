const { join } = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './index.js',
  output: {
    path: join(__dirname, 'build'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js'],
    alias: {
      '^': join(__dirname, 'src')
    },
  },
  devtool: 'inline-source-map',
};