/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-console: 0 */

Error.stackTraceLimit = 30;

const config = require('config');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');

const HOT_LOADER = !!process.env.HOT_LOADER;
const PROXY_ASSETS = config.get('proxyAssets');

webpackConfig.entry = Object.keys(webpackConfig.entry).reduce((result, item) => {
    result[item] = [
        'webpack/hot/only-dev-server',
        `webpack-dev-server/client?http://localhost:${PROXY_ASSETS.port}`
    ];

    if (HOT_LOADER) {
        result[item] = result[item].concat('react-hot-loader/patch');
    }

    result[item] = result[item].concat(webpackConfig.entry[item]);

    return result;
}, {});

if (HOT_LOADER) {
    webpackConfig.module.loaders
        .filter(loader => loader.loader === 'babel')
        .forEach((loader) => {
            if (loader.query && loader.query.plugins) {
                loader.query.plugins = ['react-hot-loader/babel'].concat(loader.query.plugins);
            }
        });
}

webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

const frontendCompiler = webpack(webpackConfig);
const frontendServer = new WebpackDevServer(frontendCompiler, {
    contentBase: webpackConfig.output.path,
    hot: true,
    quiet: false,
    noInfo: false,
    inline: true,
    lazy: false,
    filename: webpackConfig.output.filename,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    publicPath: webpackConfig.output.publicPath,
    disableHostCheck: true,
    stats: { colors: true },
    headers: {
        'X-Custom-Header': 'yes',
        'Access-Control-Allow-Origin': '*'
    }
});

frontendServer.listen(PROXY_ASSETS.port, PROXY_ASSETS.host, () => {
    console.log(`Frontend server running at http://${PROXY_ASSETS.host}:${PROXY_ASSETS.port}...`);
});