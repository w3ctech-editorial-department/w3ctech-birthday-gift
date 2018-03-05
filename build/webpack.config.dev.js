var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

var config = require('./webpack.config');
var port = process.env.PORT // PORT=3001 node ./build/server.js
    || (process.argv[2] && process.argv[2].split('=')[1]) // node ./build/server.js --port=3001
    || process.env.npm_package_config_port
    || 3000;

var devEntries = [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:' + port + '/',
    'webpack/hot/dev-server'
];

Object.keys(config.entry).forEach(function (key) {
    var mods = config.entry[key];
    config.entry[key] = devEntries.concat(Array.isArray(mods) ? mods : [mods]);
});

var fecsLoader = {
    loader: 'fecs-loader',
    options: {
        failOnError: false,
        failOnWarning: false
    }
};

var styleLoader = {
    loader: 'style-loader',
    options: {module: true}
};
config.module.rules = [
    {
        test: /\.(jpe?g|png|gif|svg|cur)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    prefix: 'img/'
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
                    prefix: 'font/'
                }
            }
        ]
    }
].concat(config.module.rules);

config.module.rules.forEach(function (rule) {
    if (String(rule.test).match(/\\\.(css|less|styl|scss)\b/)) {
        rule.use.forEach(function (loader) {
            loader.options.sourceMap = true;
        });
        rule.use.unshift(styleLoader);
        rule.use.push(fecsLoader);
    }
    else if (String(rule.use).match(/babel-loader/)) {
        rule.use = Array.isArray(rule.use) ? rule.use : [rule.use];
        rule.use.unshift('react-hot-loader/webpack');// module exports are registered
        rule.use.push(fecsLoader);
    }
});

config.output.publicPath = 'http://localhost:' + port + '/static/dist/';
config.output.devtoolModuleFilenameTemplate = function (info) {
    return "file:///" + encodeURI(info.absoluteResourcePath);
};
config.output.devtoolFallbackModuleFilenameTemplate = function (info) {
    return "file:///" + encodeURI(info.absoluteResourcePath) + '?' + info.hash;
};
config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new BundleTracker({
        filename: './build/webpack-stats.json',
        indent: 4
    }),
    new webpack.optimize.CommonsChunkPlugin({
        names: ['lib', 'manifest'],
        // minChunks: Infinity,
        minChunks: function (module, count) {
            const resource = module.resource;
            // 以 .css 结尾的资源，重复 require 大于 1 次
            return resource && /\.css$/.test(resource) && count > 1;
        },
        filename: '[name].js'
    })
].concat(config.plugins);

config.devtool = 'cheap-module-source-map';

module.exports = config;
