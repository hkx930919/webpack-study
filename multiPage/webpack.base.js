const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// 压缩插件
const TerserWebpackPlugin = require('terser-webpack-plugin')
// 分析插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin
// 解析vue文件
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const { getPages } = require('./webapck.util')
const PAGES_DIR = './src/pages/'
// 多页面入口
const entry = {}
const plugins = [
	// new HtmlWebpackPlugin({
	// 	template: './index.html'
	// }),
	// 2.0版本默认清除dist文件夹的内容
	new CleanWebpackPlugin(),
	new VueLoaderPlugin()
]

// 添加htmlwebpack
getPages().forEach(dir => {
	/**
	 * ! 多页面的多个入口
	 */
	entry[dir] = [`${PAGES_DIR}${dir}/index.js`]

	/**
	 *  @`runtime~${dir}` webpack runtime文件，在optimization.runtimeChunk中用函数配置
	 *  @dir 各页面的入口文件
	 *  @vendors optimization.splitChunks.cacheGroups配置的缓存组，配置了几个就要输入几个,提取node_module的公共组件
	 *  @common 提取两个页面的公共chunk
	 */
	const chunks = [`runtime~${dir}`, dir, 'vendors', 'common']
	const filepath = `${PAGES_DIR}${dir}/index.html`
	/**
	 * ! 有几个页面，就放置几个HtmlWebpackPlugin
	 */
	const webpackPlugin = new HtmlWebpackPlugin({
		template: filepath,
		filename: `${dir}.html`,
		chunks
	})
	plugins.push(webpackPlugin)
})

if (process.argv.indexOf('-analy') !== -1) {
	plugins.push(new BundleAnalyzerPlugin())
}

module.exports = {
	entry,
	output: {
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: ['.js', '.vue', '.json']
	},
	module: {
		rules: [
			// ! 解析vue文件loader,vue-loader+vue-template-compiler+vue-loader/lib/plugin插件
			// vue-loader默认配置热更新和hmr,如果vue或者react,多页面要自己配置hmr
			{
				test: /\.vue$/,
				use: [
					{
						loader: 'cache-loader',
						options: {
							cacheDirectory:
								'./node_modules/.cache/cache-loader',
							cacheIdentifier: 'd8927588'
						}
					},
					{
						loader: 'vue-loader',
						options: {
							compilerOptions: {
								preserveWhitespace: false
							},
							cacheDirectory: './node_modules/.cache/vue-loader',
							cacheIdentifier: 'd8927588'
						}
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader?cacheDirectory']
			},
			/**
			 * ? file,url-loader同时使用会读取不到图片
			 * ? 注释一个ok
			 */
			{
				test: /\.(png|jpg|gif|jepg)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name]_[hash].[ext]',
							outputPath: 'images/',
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
		runtimeChunk: {
			name: entrypoint => `runtime~${entrypoint.name}`
		},

		minimizer: [
			new TerserWebpackPlugin({
				cache: true,
				parallel: true
			})
		],
		splitChunks: {
			chunks: 'all',
			minSize: 10,
			minChunks: 2,
			name: true,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: 30, // ! 优先级
					minChunks: 2, // ! 最少chunk的引用次数 一个chunk是指动态引入的chunk，不是动态引入的不能算
					name: 'vendors'
					// enforce: true

					// chunks: 'initial' //! chunks为initial，那么只会提取入口文件的公共代码
				},
				common: {
					name: 'common',
					// ! 提取多页面共同的组件，不是node_modules下的，且不是各自页面的包，各自页面的包会被被默认的splitChunks配置切割
					test: module => {
						return (
							!/[\\/]node_modules[\\/]/.test(module.resource) &&
							!/[\\/](first|second)[\\/]/.test(module.resource)
						)
					},
					priority: 0,
					minChunks: 2,
					minSize: 40
					// enforce: true
					// chunks: 'initial'
				}
			}
		}
	}
}
