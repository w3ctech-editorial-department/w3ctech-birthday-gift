var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');
var ImageminPlugin = require('imagemin-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var config = require('./webpack.config');

var autoImports = [
    'whatwg-fetch',
    'babel-polyfill'
];

Object.keys(config.entry).forEach(function (key) {
    var mods = config.entry[key];
    config.entry[key] = autoImports.concat(Array.isArray(mods) ? mods : [mods]);
});

config.module.rules = [
    {
        test: /\.(jpe?g|png|gif|svg|cur)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    name: 'img/[name].[hash:6].[ext]'
                }
            }
        ]
    },
    {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'font/[name].[hash:6].[ext]'
                }
            }
        ]
    }
].concat(config.module.rules);

config.module.rules.forEach(function (rule) {
    if (String(rule.test).match(/\\\.(css|less|styl|scss)\b/)) {
        rule.use = ExtractTextPlugin.extract({use: rule.use});
    }
});

config.plugins = [
    new ExtractTextPlugin('[name].[contenthash:8].css'),
    new HashedModuleIdsPlugin(),
    new CommonsChunkPlugin({
        names: ['lib', 'manifest'],
        minChunks: Infinity
    }),
    new ImageminPlugin({
        gifsicle: {
            interlaced: true,
        },
        jpegtran: {
            progressive: true,
        },
        svgo: null
    }),
    new CompressionPlugin(),
    new BundleAnalyzerPlugin()
].concat(config.plugins);

config.output.filename = '[name].[chunkhash:8].js';
config.output.chunkFilename = '[name].[chunkhash:8].chunk.js';
config.performance = {
    hints: 'warning'
};
config.profile = true;

module.exports = config;
