// Delcare Webpack Plugins
var htmlWebpackPlugin = require('html-webpack-plugin')

// Export Webpack Settings
module.exports = {
	entry: __dirname + '/www/index.js',
	output: {
		path: __dirname + '/public',
		filename: 'bundle.js',
		publicPath: '/',
	},
	resolve: {
		alias: {
			api: __dirname + '/www/api.js',
			meta: __dirname + '/www/meta.js',
		},
	},
	devServer: {
		progress: true,
		historyApiFallback: true,
	},
	module: {
		rules: [
			{
				test: /\.js?/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						query: {
							presets: ['es2015', 'react'],
						},
					},
				],
			},
			{
				test: /\.css?/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						query: {
							modules: true,
							localIdentName: '[local]',
						},
					},
				],
			},
			{
				test: /\.(svg|eof|ttf|woff|woff2)$/,
				use: [
					{
						loader: 'url-loader',
						query: {
							limit: 5000,
							name: 'assets/fonts/[name]__[hash].[ext]',
						},
					},
				],
			},
		],
	},
	plugins: [
		new htmlWebpackPlugin({
			title: 'Keep memorize your own',
			hash: true,
			template: 'www/template.html',
			favicon: 'www/favicon.ico',
		}),
	],
}
