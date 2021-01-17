const path = require('path');

module.exports = {
	devtool: 'source-map',
	entry: "./src/frontend/js/index.tsx",
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
			}
		]
	}
}
