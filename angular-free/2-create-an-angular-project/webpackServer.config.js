var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

var port = 9999;
var config = require("./webpack.config.js");
config.entry.app.unshift("webpack-dev-server/client?http://localhost:" + port + "/", "webpack/hot/dev-server");
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    hot: true,
    inline: true,
    contentBase: "./app",
    stats: {
        colors: true
    },
});
server.listen(port);