var path = require('path');

var DashboardPlugin = require('webpack-dashboard/plugin');
var SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

var rootPath = path.resolve(__dirname, '../');
var STATIC = path.join(rootPath, 'www', 'static');

var SRC_PATH = path.join(STATIC, 'src');
var ENTRY_PATH = path.join(SRC_PATH, 'entry');
var CSS_PATH = path.join(SRC_PATH, 'css');
var CONFIG_PATH = path.join(SRC_PATH, 'config');

var babelrc = path.join(SRC_PATH, '.babelrc');

var config = {
    context: SRC_PATH,
    entry: {
        home: [
            './entry/home'
        ],
        lib: [
            'react', 'react-dom', 'redux',
            'redux-saga', 'react-redux', 'prop-types'
        ]
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            module: true,
                            camelCase: true,
                            localIdentName: '[path][name]__[local]--[hash:base64:5]',
                            getLocalIdent(context, localIdentName, localName, options) {
                                return 'css-module';
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {

                        }
                    }
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            module: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {

                        }
                    },
                    {
                        loader: 'stylus-loader',
                        options: {
                            use: []
                        }
                    }
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            extends: babelrc,
                            cacheDirectory: true
                        }
                    }
                ]
            },
            {
                test: /\.svg/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            symbolId: 'icon-[name]',
                            // extract: true,
                            // spriteFilename: 'icons.svg',
                        },
                    },
                    {
                        loader: 'svg-url-loader',
                        options: {
                            dataUrlLimit: 1024
                        }
                    },
                    {
                        loader: 'svgo-loader',
                        options: {
                            plugins: [
                                {removeTitle: true},
                                {convertColors: {shorthex: false}},
                                {convertPathData: false}
                            ]
                        }
                    }
                ]
            }
        ]
    },

    output: {
        path: path.join(STATIC, 'dist'),
        filename: '[name].js'
    },

    resolve: {
        alias: {
            css: path.join(SRC_PATH, 'css', 'entry')
        },
        modules: [
            SRC_PATH,
            'node_modules'
        ],
        enforceExtension: false,
        extensions: ['.web.js', '.ts', '.tsx', '.js', '.json', '.web.jsx', '.jsx']
    },

    stats: {
        colors: true,
        timings: true
    },

    plugins: [
        new DashboardPlugin({port: 3001}),
        new SpriteLoaderPlugin()
    ]
};

module.exports = config;
