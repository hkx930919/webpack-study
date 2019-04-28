const Merge = require('webpack-merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base')
const { getPages } = require('./webapck.util')

const devConfig = {
	mode: 'development',
	output: {
		filename: '[name].js',
		chunkFilename: '[name].js'
	},
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		contentBase: './dist',
		open: true,
		port: 3000,
		hot: true,
		hotOnly: true,
		// 开发默认打开哪个页面
		// ! 没有配置这页面时，只会打开端口号，不会打开对应的路径。如果没有加 .html 后缀，那么打开的也不是对应的那个页面，而是htmlPlugin生成的页面，不是对应的htmlPlugin模板（template选项）
		openPage: `${getPages()[0]}.html`
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
	module: {
		rules: [
			{
				test: /\.(css)$/,
				use: ['style-loader', 'css-loader', 'postcss-loader']
			}
		]
	}
}

module.exports = Merge(baseConfig, devConfig)
