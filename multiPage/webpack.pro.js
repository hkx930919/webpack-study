const Merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base')
// *将css提取为css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const proConfig = {
	mode:'production',
	output:{
		filename: '[name].[contenthash].js', // ! 源代码不变，hash值就不会变，解决浏览器缓存问题。打包上线时，用户只需要更新有变化的代码，没有变化的从浏览器缓存读取
		chunkFilename: '[name].[contenthash].js'
	},
	devtool: 'cheap-module-source-map',
	module: {
		rules: [
			{
				test: /\.(css)$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
			}
		]
	},
	plugins:[
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',//直接引用的css文件
			chunkFilename: '[name].[contenthash].css'//间接引用的css文件
		}),
		
		new webpack.HashedModuleIdsPlugin()
	],
	optimization:{
		minimizer:[
			new OptimizeCSSAssetsPlugin({})
		]
	}
}

module.exports = Merge(baseConfig,proConfig)