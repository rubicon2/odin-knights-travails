const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
	entry: {
		main: "./src/index.js",
	},
	module: {
		rules: [
			{
				test: /\.(jpg|jpeg|png|gif|svg|bmp)$/i,
				type: "asset/resource",
			},
			{
				test: /\.(woff|woff2|ttf)$/i,
				type: "asset/resource",
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "Automated Webpack Setup Project"
		}),
	],
}
