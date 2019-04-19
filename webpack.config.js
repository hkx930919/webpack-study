const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	mode: "production",
	entry: "./src/index.js",
	output: {
		filename: "output.js",
		path: path.resolve(__dirname, "dist")
    },
    devtool:'cheap-module-source-map',
	module: {
		rules: [
			{
				test:/\.js$/,
				exclude:/node_modules/,
				use:['babel-loader?cacheDirectory']
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
            },
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
			
            {
                test:/\.(css)$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            }
		]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'index.html'
        }),
        new CleanWebpackPlugin()
    ],
    devServer:{
        contentBase:'./dist',
        port:3000,
		open:true,
		hot:true
    }
};
