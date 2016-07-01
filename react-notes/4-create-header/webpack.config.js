var webpack = require('webpack'); //引入node的webpack库
var path = require('path'); //引入node的path库
var HtmlwebpackPlugin = require('html-webpack-plugin'); //引入node的html-webpack-plugin库

var config = {
	//页面入口文件配置
	entry: [
		'webpack/hot/dev-server', //热部署
		'webpack-dev-server/client?http://localhost:3000', //本地服务端口
		'./index.js' //入口文件
	],
	//入口文件输出配置
	output: {
		path: path.resolve(__dirname, 'build'), // 指定编译后的代码位置为 build
		filename: 'bundle.js' //打包JavaScript文件以及依赖(就是那些第三方的库)文件
	},
	module: {
		//加载器配置
		loaders: [
			//.jsx 文件使用babel-loader来编译处理
			{
				test: /\.jsx?$/,
				loader: 'babel',
				exclude: /node_modules/,
				query: {
					presets: ['react', 'es2015']
				}
			},
			//.less 文件使用 style-loader/css-loader/less-loader 来处理
			{
				test: /\.less$/,
				loaders: ['style', 'css', 'less'],
				include: path.resolve(__dirname, 'less')
			},
			//.jsx 文件使用babel-loader来编译处理
			{
				test: /\.js$/,
				loaders: ['babel'],
				exclude: /node_modules/
			},
			//图片文件使用 url-loader 来处理，小于8kb的直接转为base64
			{
				test: /\.(jpg|png)$/,
				loader: "url?limit=8192"
			}
		]
	},
	//插件项
	plugins: [
		new HtmlwebpackPlugin({
			title: 'React',
			template: path.resolve(__dirname, 'templates/index.ejs'),
			inject: 'body'
		}),
	],
};

module.exports = config;
