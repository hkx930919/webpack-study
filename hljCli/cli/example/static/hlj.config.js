/*
具体配置项参考
http://172.16.10.4:3018/hlj-frontend/hlj-cli/src/branch/master/README.md#hljconfigjs
 */
module.exports = {
  page: ['example'],
  port: 3000,
  // pc端需置为null
  pxtorem: true,
  publicPath(env) {
    return {
      dev: '../',
      publish: '../'
    }[env]
  }
}
