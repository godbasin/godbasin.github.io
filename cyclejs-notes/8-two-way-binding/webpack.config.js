var webpack = require('webpack');
var path = require('path'); //引入node的path库
var HtmlwebpackPlugin = require('html-webpack-plugin');

var config = {
    entry: {
        app: [path.resolve(__dirname, 'src/index.tsx')]
    }, //入口文件
    output: {
        path: path.resolve(__dirname, 'dist'), // 指定编译后的代码位置为 dist/bundle.js
        filename: './bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            utils: path.resolve(__dirname, 'src', 'utils'),
            components: path.resolve(__dirname, 'src', 'components'),
        }
    },
    module: {
        rules: [
            // 为webpack指定loaders
            {
                test: /\.tsx?$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlwebpackPlugin({
            title: 'cycle.js demo',
            template: path.resolve(__dirname, 'index.html'),
            inject: 'body'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.ProvidePlugin({
            html: ['snabbdom-jsx', 'html']
        })
    ],
    devtool: 'source-map'
};

module.exports = config;