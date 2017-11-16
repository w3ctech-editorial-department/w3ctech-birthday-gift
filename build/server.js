var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.dev');
var childProcess = require('child_process');

var port = process.env.PORT // PORT=3001 node ./build/server.js
    || (process.argv[2] && process.argv[2].split('=')[1]) // node ./build/server.js --port=3001
    || process.env.npm_package_config_port
    || 3000;

try {
    childProcess.exec('kill -9 `lsof -t -i:' + port + '`');
    // childProcess.exec('kill -9 `lsof -t -i:' + 9876 + '`');
}
catch (ex) {
}

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    // It suppress error shown in console, so it has to be set to false.
    quiet: false,
    // It suppress everything except error, so it has to be set to false as well
    // to see success build.
    noInfo: false,
    stats: {
        // Config for minimal console.log mess.
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
    },
    headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*'
    }
}).listen(port, 'localhost', function (err) {
    console.log(err || 'start server at port: ' + port);
});
