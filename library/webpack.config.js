const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const plugins = [
	
	// 2.0版本默认清除dist文件夹的内容
	new CleanWebpackPlugin()
];


module.exports = {
	mode: "production",
	entry: "./src/index.js",
	output: {
		filename: "hkx-util.js",
		chunkFilename: "[name].js",
		path: path.resolve(__dirname, "dist"),
		library: 'hkxUtil',
		libraryTarget: 'umd'
	},
	devtool: "cheap-module-source-map",
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ["babel-loader?cacheDirectory"]
			},
		]
	},
	plugins,
	
	optimization: {
		minimizer: [
			new TerserWebpackPlugin({
				cache: true,
				parallel: true
			})
		],
		splitChunks: {
			chunks: "all",
			minSize: 10,
			minChunks: 2,
			name: true,
			cacheGroups: {
				common: {
					priority: 0,
					minChunks: 2,
					minSize: 10
				}
			}
		}
	}
};
