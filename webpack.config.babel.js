import { resolve } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import StringReplacePlugin from "string-replace-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import crypto from "crypto";

function hash(string) {
  return crypto
    .createHash("sha256")
    .update(string, "utf8")
    .digest("HEX")
    .substring(0, 4);
}

export default (_, { analyze }) => {
  const config = {
    devtool: "source-map",
    devServer: {
      host: "0.0.0.0",
      hot: true,
    },
    resolve: {
      alias: {
        "react-dom$": "react-dom/profiling",
        "scheduler/tracing": "scheduler/tracing-profiling",
      },
    },
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: resolve("public"),
    },
    stats: "errors-only",
    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles.css",
      }),
      new HtmlWebpackPlugin({ template: "./src/index.html" }),
      new StringReplacePlugin(),
      new FaviconsWebpackPlugin("./src/images/logo.png"),
    ],
    optimization: {
      minimize: true,
      splitChunks: {
        cacheGroups: {
          scenes: {
            test: (module) => {
              return (
                module
                  .identifier()
                  .split("/")
                  .reduceRight((item) => item) === "scene.svg"
              );
            },
            name(module) {
              const moduleFolder = module
                .identifier()
                .split("/")
                .slice(1, -1)
                .pop();

              return `${moduleFolder}`;
            },
            filename: "[name].js",
            enforce: true,
            chunks: "initial",
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: ["babel-loader"],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === "development",
              },
            },
            { loader: "css-loader", options: { importLoaders: 1 } },
            {
              loader: "postcss-loader",
              options: {
                ident: "postcss",
                plugins: (loader) => [
                  require("postcss-import")({ root: loader.resourcePath }),
                  require("postcss-preset-env")(),
                  require("postcss-nested")(),
                  require("cssnano")(),
                  require("autoprefixer")(),
                ],
              },
            },
          ],
        },
        {
          test: /\.html$/,
          use: ["html-loader"],
        },
        {
          test: /\.(gif|png|jpe?g)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "images/[name].[ext]",
              },
            },
            "image-webpack-loader",
          ],
        },
        {
          test: /\.mp4$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "images/[name].[ext]",
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          issuer: {
            test: /\.js?$/,
          },
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                memo: true,
                svgoConfig: {
                  plugins: [
                    { prefixIds: false },
                    {
                      cleanupIDs: false,
                    },
                    {
                      reusePaths: true,
                    },
                    {
                      convertShapeToPath: false,
                    },
                  ],
                },
              },
            },
            {
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
                  {
                    pattern: /SVGID/gi,
                    replacement: (match, offset, string) => `${hash(string)}_`,
                  },
                ],
              }),
            },
          ],
        },
      ],
    },
  };

  if (analyze) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
      })
    );
  }

  return config;
};
