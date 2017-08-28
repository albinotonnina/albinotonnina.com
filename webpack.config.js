const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');
var StringReplacePlugin = require("string-replace-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "styles.css"
});

module.exports = {
    devtool: 'source-map',
    entry: './src/scripts/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    plugins: [
        extractSass,
        // new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({template: './src/index.hbs'}),
        new ModernizrWebpackPlugin({
            'feature-detects': [
                'svg'
            ]
        }),
        new StringReplacePlugin()
    ],
    module: {
        rules: [
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader',
                query: {
                    partialDirs: [
                        path.join(__dirname, 'src')
                    ],
                    inlineRequires: '/images/'
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }]
                })
            },

            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader?classPrefix'
            },
            {
                test: /\.svg$/,
                loader: StringReplacePlugin.replace({
                    replacements: [
                        {
                            pattern: /font-family="'Roboto-Thin'"/ig,
                            replacement: function (match, p1, offset, string) {
                                return 'font-weight="100"';
                            }
                        },
                        {
                            pattern: /font-family="'Roboto-Light'"/ig,
                            replacement: function (match, p1, offset, string) {
                                return 'font-weight="300"';
                            }
                        },
                        {
                            pattern: /font-family="'Roboto-Regular'"/ig,
                            replacement: function (match, p1, offset, string) {
                                return 'font-weight="400"';
                            }
                        },
                        {
                            pattern: /font-family="'Roboto-Black'"/ig,
                            replacement: function (match, p1, offset, string) {
                                return 'font-weight="900"';
                            }
                        }
                    ]
                })
            }
        ]
    }
};