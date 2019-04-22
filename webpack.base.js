const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin;
console.log("*************", process.argv);
const plugins = [
	new HtmlWebpackPlugin({
		template: "./index.html"
	}),
	// 2.0版本默认清除dist文件夹的内容
	new CleanWebpackPlugin(),


];
if (process.argv.indexOf("-analy") !== -1) {
	plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "dist")
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ["babel-loader?cacheDirectory"]
			},
			/**
			 * ? file,url-loader同时使用会读取不到图片
			 * ? 注释一个ok
			 */
			{
				test: /\.(png|jpg|gif|jepg)$/i,
				use: [
					{
						loader: "url-loader",
						options: {
							name: "[name]_[hash].[ext]",
							outputPath: "images/",
							limit: 10240
						}
					}
				]
			}
			// {
			// 	test: /\.(png|jpg|gif|jepg)$/i,
			// 	use: [
			// 		{
			// 			loader: "file-loader",
			// 			options: {
			// 				name: "[name].[ext]",
			// 				outputPath: "images/"
			// 			}
			// 		}
			// 	]
			// },
		]
	},
	plugins,
	optimization: {
		runtimeChunk: 'single',
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
				vendors:{
					test:/[\\/]node_modules[\\/]/,
					priority: -10,
      				name: 'vendors',
				},
				common: {
					priority: 0,
					minChunks: 2,
					minSize: 10
				},

			}
		}
	}
};
