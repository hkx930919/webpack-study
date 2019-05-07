## 1 npx 打包命令

-   使用 npx webpack，当项目中有 webpack.config.js 时，会运行配置文件进行打包。如果没有配置文件，会用 webpack 默认的配置，入口文件 src/index.js，输出文件 dist/main.js

## 2 基础 loader

-   file-loader 图片,字体文件，
    > 解决 CSS 等文件中的引入图片路径问题
-   url-loader 图片，
    > 当图片小于 limit 的时候会把图片 BASE64 编码，大于 limit 参数的时候还是使用 file-loader 进行拷贝
-   css-loader style-loader css 样式，

    > css-loader：分析几个 css 文件之间的关系，最终合并为一个 css
    > style-loader:在得到 css 生成的内容时，把其挂载到 html 的 head 里，成为内联样式。

    ```
    module.exports = {
      module: {
          rules: [
          {
              test: /\.css$/, //匹配以css为后缀的文件
              use: ['style-loader', 'css-loader'],//loader的执行顺序是从右向左，从下到上。css-loader：分析几个css文件之间的关系，最终合并为一个css。style-loader:在得到css生成的内容时，把其挂载到html的head里，成为内联样式。
          },
          ],
      },
    };

    ```

-   sass-loader node-sass saas

    ```
    module.exports = {
        ...
        module: {
            rules: [{
                test: /\.scss$/,
                use: [
                    "style-loader", // 将 JS 字符串生成为 style 节点
                    "css-loader", // 将 CSS 转化成 CommonJS 模块
                    "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
                ]
            }]
        }
    };

    ```

-   postcss-loader autoprefixer 为 css 样式属性加不同浏览器的前缀

    > 在项目跟目录下创建 postcss.config.js

    ```
    module.exports = {
        plugins: [
            require('autoprefixer')
        ]
    }
    ```

## 3 webpack4 的改变
- 新增optimization配置项，optimization.minimizer（压缩配置，包括js:TerserWebpackPlugin,css:OptimizeCSSAssetsPlugin）和optimization.splitChunks（类似CommonsChunkPlugin，提取公共代码）
- 提取css插件使用mini-css-extract-plugin
- output.filename增加\[contenthash\],根据内容生成的hash值，可以有效的利用缓存。
    >因为runtime和manifest的不同，如果没有提取runtime会导致每次打包不一致
    >因为moduleid不同，开发环境使用webpack.NamedModulesPlugin,这个打包会慢点，生产环境使用webpack.HashedModuleIdsPlugin()保证moduleid一致。


