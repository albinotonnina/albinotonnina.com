module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-preset-env'),
    require('postcss-nested'),
    require('cssnano'),
    require('autoprefixer'),
  ],
};
