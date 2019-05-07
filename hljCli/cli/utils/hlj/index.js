const fs = require('fs-extra')
const { join } = require('path')
const { shellSync, shell } = require('execa')
const { __nodeModules, __hljConfig, __pkgJson, __src } = require('../paths')
const {
  vueServerNpmName,
  reactServerNpmName,
  reactAdminNpmName
} = require('../constant')

function isHljProject() {
  const { dependencies = {}, devDependencies = {} } = require(__pkgJson)
  return (
    (fs.pathExistsSync(__hljConfig) &&
      fs.pathExistsSync(__src) &&
      (dependencies[vueServerNpmName] ||
        devDependencies[vueServerNpmName] ||
        dependencies[reactServerNpmName] ||
        devDependencies[reactServerNpmName])) ||
    dependencies[reactAdminNpmName] ||
    devDependencies[reactAdminNpmName]
  )
}
// 设置zc.config.js中的page字段
function setPageNameOfHljConfig(name) {
  if (!fs.pathExistsSync(__hljConfig)) {
    fs.writeFileSync(
      __hljConfig,
      `
module.exports = {
  page: ['${name}']
}
`.trim()
    )
  } else {
    const res = fs.readFileSync(__hljConfig, 'utf8')
    fs.writeFileSync(
      __hljConfig,
      res.replace(
        /page\s*:\s*((\[(.+?)\])|('(.+?)')|("(.+?)"))\s*,?/g,
        `page:['${name}'],`
      )
    )
  }
}

function getHljServerVersion(name = vueServerNpmName) {
  return shellSync(`npm view ${name} version`).stdout
}
function setPkgJson(projectName, serverNpmName = vueServerNpmName) {
  const latestVer = getHljServerVersion(serverNpmName)
  const { stdout } = shellSync('git config user.name')
  const packagePath = join(process.cwd(), projectName, 'package.json')
  const pkgJson = require(packagePath)
  pkgJson.name = projectName
  pkgJson.author = stdout
  pkgJson.devDependencies[serverNpmName] = latestVer
  if (pkgJson.dependencies && pkgJson.dependencies[serverNpmName]) {
    delete pkgJson.dependencies[serverNpmName]
  }
  fs.writeFileSync(packagePath, JSON.stringify(pkgJson, null, 2))
}
function shouldUpdateHljServer(name = vueServerNpmName) {
  try {
    const currentVer = require(join(__nodeModules, `${name}/package.json`))
      .version
    const latestVer = getHljServerVersion(name)
    if (latestVer !== currentVer) {
      return {
        currentVer,
        latestVer
      }
    }
    return false
  } catch (e) {
    return true
  }
}
function getHljConfig() {
  return Object.assign(resConfig, require(__hljConfig))
}
async function getHljServerDep() {
  let { stdout } = await shell(`npm view ${vueServerNpmName} dependencies`)
  stdout = stdout.trim()
  return stdout
    .substring(1, stdout.length - 1)
    .split(',')
    .map(item => {
      let key = item.substring(0, item.indexOf(':')).trim()
      if (key.charAt(0) === "'" || key.charAt(0) === '"') {
        key = key.substring(1, key.length - 1)
      }
      return key
    })
}
/*
获取工程类型，暂时有react和vue
 */
function getProjectType() {
  const { dependencies = {}, devDependencies = {} } = require(__pkgJson)
  if (dependencies[vueServerNpmName] || devDependencies[vueServerNpmName]) {
    return 'vue'
  }
  if (dependencies[reactServerNpmName] || devDependencies[reactServerNpmName]) {
    return 'react'
  }
  if (dependencies[reactAdminNpmName] || devDependencies[reactAdminNpmName]) {
    return 'react-admin'
  }
  return null
}
module.exports = {
  isHljProject,
  setPageNameOfHljConfig,
  getHljServerVersion,
  setPkgJson,
  shouldUpdateHljServer,
  getHljConfig,
  getHljServerDep,
  getProjectType
}
