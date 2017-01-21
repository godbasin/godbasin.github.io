var webpack = require('webpack');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

var config = {
    entry: {
        app: ['./app/bootstrap.js'] // 入口文件
    },
    output: {
        path: path.resolve(__dirname, 'app/entry'), // 编译后文件
        publicPath: '/entry/',
        filename: 'bundle.js' // 生成文件名
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        },
        {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract('css-loader?sourceMap!autoprefixer-loader!less-loader?sourceMap')
        }]
    },
    plugins: [
        // 使用CommonChunksLoader来提取公共模块
        new CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.js',
            minChunks: function (module) {
                var userRequest = module.userRequest;
                if (typeof userRequest !== 'string') {
                    return false;
                }
                return userRequest.indexOf('node_modules') >= 0
            }
        })
    ]
};

module.exports = config;