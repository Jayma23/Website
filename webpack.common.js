const path = require('path');

module.exports = {
  entry: {
    app: './public/js/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'js/[name].js', // ✅ 自动变成 js/app.js
  }
};
