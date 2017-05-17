var webpack = require('webpack');
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');

var config = {
    entry: ['babel-polyfill', './src/bootstrap.ts'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["babel-loader", "ts-loader", "angular2-template-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.(html|css)$/,
                use: ['raw-loader'],
                exclude: [path.resolve(__dirname, 'src/index.html')]
            },
            {
                test: /\.async\.(html|css)$/,
                loaders: ['file?name=[name].[ext]']
            }]
    },
    plugins: [
        new HtmlwebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            inject: 'body'
        }),
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve(__dirname, 'src'),
            {}
        )
    ],
    devtool: 'source-map'
};


module.exports = config;
