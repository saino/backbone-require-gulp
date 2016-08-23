/**
 * Created by chenshy on 2016/8/12.
 */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');
new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    noInfo: false,
    historyApiFallback: true
}).listen(80, '127.0.0.1', function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log('Listening at localhost:80');
    });