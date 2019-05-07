const Merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base')

const devConfig = {
	mode:'development',
	output:{
		filename: '[name].js',
		chunkFilename: '[name].js'
	},
	devtool: 'cheap-module-eval-source-map',
	devServer:{
		contentBase:'./dist',
		open:true,
		port:3000,
		hot:true,
		hotOnly: true
	},
	plugins: [	
		new webpack.HotModuleReplacementPlugin()
	],
	module: {
		rules: [
			{
				test: /\.(css)$/,
				use: ['style-loader', "css-loader", "postcss-loader"]
			}
		]
	},
}

module.exports = Merge(baseConfig,devConfig)