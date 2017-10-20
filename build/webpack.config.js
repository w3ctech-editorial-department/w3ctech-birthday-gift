var path = require('path');

var autoprefixer = require('autoprefixer');
var sorting = require('postcss-sorting');

var rootPath = path.resolve(__dirname, '../');
var STATIC = path.join(rootPath, 'www', 'static');

var SRC_PATH = path.join(STATIC, 'src');
var ENTRY_PATH = path.join(SRC_PATH, 'entry');
var CSS_PATH = path.join(SRC_PATH, 'css');
var CONFIG_PATH = path.join(SRC_PATH, 'config');

var sortingConfig = require(path.join(CONFIG_PATH, 'postcssSorting.js'));

var config = {
    context: SRC_PATH,
    entry: {
        home: [
            './entry/home'
        ],
        lib: [
            'react', 'react-dom', 'redux', 'redux-saga',
            'react-redux', 'redux-thunk', 'prop-types'
        ]
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {module: false}
                    }
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {importLoaders: 2, module: false}
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer(),
                                sorting(sortingConfig)
                            ]
                        },
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
                exclude: /node_modules/,
                use: 'babel-loader'
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
    plugins: []
};

module.exports = config;
