const { resolve } = require('path')
const resolvePath = src => resolve(process.cwd(), src)
const { hljConfigName } = require('../constant')
module.exports = {
  __pkgJson: resolvePath('package.json'),
  __hljConfig: resolvePath(hljConfigName),
  __root: process.cwd(),
  __src: resolvePath('src'),
  __page: resolvePath('page'),
  __nodeModules: resolvePath('node_modules'),
  __base: resolvePath('src/__BASE__'),
  __yarnLock: resolvePath('yarn.lock'),
  __packageLock: resolvePath('package-lock.json')
}
