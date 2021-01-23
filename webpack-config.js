const path = require('path');

module.exports = {
	devtool: 'source-map',
	entry: "./src/frontend/js/index.js",
	mode: "development",
	output: {
		path: path.resolve(__dirname, "build/frontend/js"),
		filename: "./index.js"
	},
	resolve: {
		extensions: ['.Webpack.js', '.web.js', '.ts', '.js', '.jsx', '.tsx']
	},
	module: {
		rules: [
			{
				test: /\.tsx$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'ts-loader'
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.(jpg|png)$/,
				use: {
					loader: 'url-loader',
				},
			},
		]
	}
}
