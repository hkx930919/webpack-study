# 多页面配置实践

## 1 entry 配置

-   多页面要在 entry 配置多个入口，且都要有相匹配的 html

    -   为此，目录结构必须要清晰，在此 demo 中，页面统一在 src/pages 下面，每个文件夹下的 index.js 就是对应页面的入口，每个页面的 html 模板在该文件夹下的 index.html

    ```
    //获取页面入口

    const path = require('path')
    const fs = require('fs')
    const PAGES_DIR = './src/pages/'
    // 获取文件夹名称
    function getPages() {
        return fs.readdirSync(PAGES_DIR).filter(dir => {
            let filePath = path.join(PAGES_DIR, dir, 'index.js')
            if (!fs.existsSync(filePath)) {
                filePath = `${filePath}x`
            }
            if (!fs.existsSync(filePath)) {
                return false
            }
            return true
        })
    }
    // 多个入口
    const entry = {}
    entry[dir] = [`${PAGES_DIR}${dir}/index.js`]
    ```

## 2 配置多个 HtmlWebpackPlugin

-   有几个页面，就需要配置几个 HtmlWebpackPlugin

    -   在此 demo 中，每个 HtmlWebpackPlugin 的 template 为对应文件夹下的 index.html

    ```
    // 根据多个页面添加htmlwebpack和entry

    getPages().forEach(dir => {
        /**
        * ! 多页面的多个入口
        */
        entry[dir] = [`${PAGES_DIR}${dir}/index.js`]
    ```


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
    ```

## 3 webpack-dev-server 开发配置

-   多页面的情况下，开发时要指定 dev-server 打开的页面,例如打开多页面下的 first.html _http://localhost:3000/first.html#/index_
    ```
    // 默认打开第一个页面
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
    ```

## 4 开发时的热更新

-   如果没有使用 vue-loader 或者 react 自带的热更新，开发时必须手动的在文件中使用热更新，不然不会 hmr
-   使用 vue-loader 配置热更新

    -   下载 vue-loader 和 vue-template-compiler
    -   使用 vue-loader 下的插件

        ```
        const VueLoaderPlugin = require('vue-loader/lib/plugin')
        const plugins = [
        // 2.0版本默认清除dist文件夹的内容
        new CleanWebpackPlugin(),
        new VueLoaderPlugin()

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

        ```

## 5 提取公共代码

-   1 多个页面共有的 node_modules 文件，vendors chunk
-   2 多个页面共有的组件或者工具方法，common chunk
-   3 每个页面下的公共组件由 webpack 默认的配置进行提取 a~b.js
-   4 注意每个页面使用 import()动态引入文件时，最好指定 webpackChunkName,且每个页面里的 webpackChunkName 必须不一样，最好加上 page 名称前缀，不然打包时会将 webpackChunkName 相同的同时打包进去，造成一个页面下有别的页面的代码

    > import(/_ webpackChunkName: 'second.a' _/ './a.js')
    > import(/_ webpackChunkName: 'second.b' _/ './b.js')
    > import(/_ webpackChunkName: 'first.a' _/ './a.js')
    > import(/_ webpackChunkName: 'first.b' _/ './b.js')

-   5 提取每个页面的 runtimeThunk
    > runtimeChunk: {name: entrypoint => \`runtime~\${entrypoint.name}`},

```
splitChunks: {
			chunks: 'all',
			minSize: 10,
			minChunks: 2,
			name: true,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: 30, // ! 优先级
					minChunks: 2, // ! 最少chunk的引用次数 一个chunk是指动态引入的chunk，不是动态引入的不能算技巧怒
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
```
