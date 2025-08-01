const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const dotenv = require('dotenv');
const webpack = require('webpack');

const env = dotenv.config().parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: ['./public'],
  },
  plugins: [
    new webpack.DefinePlugin(envKeys)  // ⬅️ 关键插件
  ]
});
