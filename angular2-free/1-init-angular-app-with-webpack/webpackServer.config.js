var webpack = require('webpack');
var path = require('path'); //引入node的path库
var config = require("./webpack.config.js");
config.entry.concat(['webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3333'
]);
module.exports = config;