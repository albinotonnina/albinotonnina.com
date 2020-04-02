const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const StringReplacePlugin = require("string-replace-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const imageminMozjpeg = require("imagemin-mozjpeg");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = () => {
  return {
    devtool: "source-map",
    devServer: {
      host: "0.0.0.0",
    },
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "bundle.js",
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles.css",
      }),
      new HtmlWebpackPlugin({ template: "./src/index.html" }),
      new StringReplacePlugin(),
      new ImageminPlugin({
        plugins: [
          imageminMozjpeg({
            quality: 40,
            progressive: true,
          }),
        ],
      }),
      new FaviconsWebpackPlugin({
        logo: "./src/images/logo.png",
        title: "albinotonnina.com",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === "development",
              },
            },
            "css-loader",
            "sass-loader",
          ],
        },

        {
          test: /\.html$/,
          use: ["html-loader"],
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
        {
          test: /\.svg$/,
          loader: "svg-inline-loader?classPrefix",
        },
        {
          test: /\.svg$/,
          loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: /font-family="'Roboto-Thin'"/gi,
                replacement: () => 'font-weight="100"',
              },
              {
                pattern: /font-family="'Roboto-Light'"/gi,
                replacement: () => 'font-weight="300"',
              },
              {
                pattern: /font-family="'Roboto-Regular'"/gi,
                replacement: () => 'font-weight="400"',
              },
              {
                pattern: /font-family="'Roboto-Black'"/gi,
                replacement: () => 'font-weight="900"',
              },
            ],
          }),
        },
      ],
    },
  };
};
