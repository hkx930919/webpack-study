module.exports = {
  /**
   cli
   */
  cliNpmName: '@hlj/cli', // cli工程发布的npm包名称
  cliScriptName: 'hlj', //@hlj/cli包全局安装后可在全局中执行的命令的名字
  hljConfigName: 'hlj.config.js', // 配置文件的名字
  /**
   vue
   */
  // vue-server工程发布的npm包名称
  vueServerNpmName: '@hlj/vue-server',
  // @hlj/vue-server包安装后可在package.json中执行的命令的名字
  vueServerScriptName: 'hlj-vue-server',
  // 创建vue项目的模板git地址
  vueTplGitPath:
    'http://git.hljnbw.cn/zhi_shui/hlj-vue-project-boilerplate.git',
  // 创建vue项目页面的模板git地址
  vuePageGitPath: 'http://git.hljnbw.cn/zhi_shui/hlj-vue-page-boilerplate.git',
  // 移动端vue-UI库相关hlj-mui工程发布的 npm 包名称
  muiNpmName: '@hlj/m-ui',
  /**
   工具库share
   */
  // share工程发布的npm包名称
  shareNpmName: '@hlj/share',

  /**
   react
   */
  // react-server工程发布的npm包名称
  reactServerNpmName: '@hlj/react-server',
  // @hlj/react-server包安装后可在package.json中执行的命令的名字
  reactServerScriptName: 'hlj-react-server',
  // 创建react项目的模板git地址
  reactTplGitPath:
    'http://git.hljnbw.cn/zhi_shui/hlj-react-project-boilerplate.git',
  /**
   * react-admin
   */
  // react-admin工程发布的npm包名称
  reactAdminNpmName: '@hlj/react-admin',
  // @hlj/react-admin包安装后可在package.json中执行的命令的名字
  reactAdminScriptName: 'hlj-react-admin'
}
