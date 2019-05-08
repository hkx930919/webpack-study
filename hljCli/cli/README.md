## 1 hlj-create 创建项目

- 1 拿到项目名和要创建的类型（vue/react）
- 2 拿到项目根路径，git clone 仓库模板代码
- 3 删除项目.git 文件夹
- 4 修改项目 package.json 文件
- 5 安装依赖，项目 create 完成

## 2 创建页面

- 1 拿到页面名称
- 2 判断页面['__BASE__', 'static']，再判断页面是否存在
- 3 删除脚手架 templeate 目录
- 4 在脚手架 templeate 目录 git clone 模板代码
- 5 将脚手架 templeate 中 html 文件复制到工程中的 page 文件夹
- 6 将脚手架 templeate 中 src 文件夹复制到工程中的 src/pagename
- 7 执行 git add . 操作
- 8 删除脚手架 templeate 文件夹，页面创建成功

## 3 创建新路由

- 1 拿到 routeName
- 2 拿到 pagename,如果没有输入 pagename，那么在命令行输入
- 3 判短新路由是否存在，不存在才可以创建
- 4 拿到工程中该页面对应的 router.js,读取 router.js 内容，用正则替换里面的内容，并新增一个路由
- 5 将脚手架中的页面 copy 到项目中的新路由，路由创建完成
