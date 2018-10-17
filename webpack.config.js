/* eslint import/no-extraneous-dependencies: 0 */

const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ARUI_TEMPLATE = require('arui-presets/webpack.base');
const ARUI_TS_TEMPLATE = require('arui-presets-ts/webpack');
const ARUI_DEV_TEMPLATE = require('arui-presets/webpack.development');
const aruiProdConfigBuilder = require('arui-presets/webpack.production-builder');

const ARUI_PROD_TEMPLATE = aruiProdConfigBuilder({ extractOptions: { publicPath: './' } });
const IS_DEVELOP = (process.env.NODE_ENV === 'development');
const IS_PRODUCTION = (process.env.NODE_ENV === 'production');

let webpackConfig = merge.smart(
    ARUI_TEMPLATE,
    ARUI_TS_TEMPLATE,
    {
        entry: {
            index: [
                './node_modules/arui-feather/polyfills.js',
                './src/index.jsx'
            ]
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'ARUI Feather Bootstrap',
                filename: '../index.hbs',
                template: require.resolve('./src/server/plugins/pages/index.html.ejs'),
                alwaysWriteToDisk: true,
                inject: false,
                isProduction: IS_PRODUCTION,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                }
            }),
            new HtmlWebpackHarddiskPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'process.HOT_LOADER': process.env.HOT_LOADER
            }),
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, 'src/icons'),
                    to: path.resolve('', './assets')
                }
            ])
        ]
    },
    !IS_DEVELOP ? ARUI_PROD_TEMPLATE : ARUI_DEV_TEMPLATE
);

module.exports = webpackConfig;