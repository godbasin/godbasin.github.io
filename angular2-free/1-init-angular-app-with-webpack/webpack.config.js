var webpack = require('webpack');
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');

var config = {
    // 入口
    entry:  ['babel-polyfill', './src/bootstrap.ts'],
    // 生成的文件
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './bundle.js'
    },
    // 文件后缀
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        // babel
        rules: [
            {
            test: /\.ts$/,
            use: ["babel-loader", "ts-loader"],
            exclude: /node_modules/
        },
        {
            test: /\.css$/, // Only .css files
            use: ["style-loader", "css-loader"]
        }]
    },
    plugins: [
        // plugins
        new HtmlwebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            inject: 'body'
        })
    ],
    devtool: 'source-map'
};

module.exports = config;