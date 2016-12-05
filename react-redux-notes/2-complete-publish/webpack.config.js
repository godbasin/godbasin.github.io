var webpack = require('webpack');
var path = require('path'); //引入node的path库
var HtmlwebpackPlugin = require('html-webpack-plugin');

var config = {
    entry: ['babel-polyfill',
        path.resolve(__dirname, 'app/index.js')
    ], //入口文件
    output: {
        path: path.resolve(__dirname, 'dist'), // 指定编译后的代码位置为 dist/bundle.js
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            // 为webpack指定loaders
            {
                test: /\.less$/,
                loaders: ['style', 'css', 'less'],
                include: path.resolve(__dirname, 'app')
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: 'node_modules'
            },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    plugins: [
        new HtmlwebpackPlugin({
            title: 'React Biolerplate by Linghucong',
            template: path.resolve(__dirname, 'templates/index.ejs'),
            inject: 'body'
        })
    ],
    devtool: 'source-map'
}

module.exports = config;