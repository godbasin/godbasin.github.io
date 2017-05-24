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
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre",
                exclude: [
                    path.join(__dirname, 'node_modules', '@angular/compiler'),
                    path.join(__dirname, 'node_modules', 'rxjs')
                ]
            },
            {
                test: /\.ts$/,
                use: ["babel-loader", "ts-loader", "angular2-template-loader", "angular-router-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.(html|css)$/,
                use: ['raw-loader'],
                exclude: [path.resolve(__dirname, 'src/index.html')]
            }]
    },
    plugins: [
        new HtmlwebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            inject: 'body'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve(__dirname, 'src'),
            {}
        ),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
    devtool: 'source-map'
};


module.exports = config;
