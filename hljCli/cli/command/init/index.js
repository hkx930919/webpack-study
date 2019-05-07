const fs = require('fs-extra')
const { join } = require('path')
const { shell } = require('execa')
const { success, getSpinner, installDep, error } = require('../../utils/tools')
const { vueServerScriptName, vueServerNpmName, hljConfigName } = require('../../utils/constant')
const {
  __pkgJson,
  __src,
  __page,
  __root,
  __nodeModules,
  __yarnLock,
  __packageLock
} = require('../../utils/paths')
const {
  getHljServerDep,
  getHljServerVersion,
  setPageNameOfHljConfig,
  getProjectType
} = require('../../utils/hlj')
const type = getProjectType()

function createExample() {
  let exampleName = 'example'
  fs.copySync(join(__dirname, '../example/index.html'), join(__page, exampleName + '.html'))
  fs.copySync(join(__dirname, '../example/src'), join(__src, exampleName))
  setPageNameOfHljConfig(exampleName)
}
function existInSrcButNotPage(name) {
  return !fs.pathExistsSync(join(__page, name + '.html')) && fs.pathExistsSync(join(__src, name))
}
function createStaticAtRoot(name, isOverride = true, rename) {
  rename = rename || name
  if (isOverride || !fs.pathExistsSync(join(__root, name))) {
    fs.copySync(join(__dirname, `../example/static/${name}`), join(__root, rename))
  }
}
function copyStatic() {
  if (!fs.pathExistsSync(join(__root, 'static')) && existInSrcButNotPage('static')) {
    fs.copySync(join(__src, 'static'), join(__root, 'static'))
    fs.removeSync(join(__src, 'static'))
  }
}
function createTpl() {
  createStaticAtRoot(hljConfigName)
  createStaticAtRoot('build.sh')
  createExample()
}
module.exports = async function() {
  if (type !== 'vue') {
    return warning(`\n init 命令目前只适用于cli创建的vue多页面工程`)
  }
  const initSpinner = getSpinner('正在初始化工程...')
  try {
    initSpinner.start()
    createStaticAtRoot('git-ignore', false, '.gitignore')
    if (!fs.pathExistsSync(__pkgJson)) {
      await shell('npm init -f')
    }
    //获取zc-server的所有依赖，之后和当前项目的依赖做对比
    const allVueServerDep = await getHljServerDep()
    const currPkg = require(__pkgJson)
    const currDep = currPkg.dependencies || {}
    const currDevDep = currPkg.devDependencies || {}
    const scripts = currPkg.scripts
    //设置scripts
    if (!scripts) {
      currPkg.scripts = {
        start: `${vueServerScriptName} start`,
        build: `${vueServerScriptName} build`
      }
    } else {
      scripts.start = `${vueServerScriptName} start`
      scripts.build = `${vueServerScriptName} build`
    }
    //设置prettier
    if (!currPkg.prettier) {
      currPkg.prettier = {
        semi: false,
        singleQuote: true,
        tabWidth: 2
      }
    }
    const currNewDep = {}
    const currNewDevDep = {}
    for (let name in currDep) {
      if (!allVueServerDep.includes(name)) {
        currNewDep[name] = currDep[name]
      }
    }
    for (let name in currDevDep) {
      if (!allVueServerDep.includes(name)) {
        currNewDevDep[name] = currDevDep[name]
      }
    }
    currNewDevDep[vueServerNpmName] = getHljServerVersion(vueServerNpmName)
    currPkg.dependencies = currNewDep
    currPkg.devDependencies = currNewDevDep
    fs.writeFileSync(__pkgJson, JSON.stringify(currPkg, null, 2))
    createTpl()
    copyStatic()
    await fs.remove(__nodeModules)
    await fs.remove(__yarnLock)
    await fs.remove(__packageLock)
    await installDep()
    await shell('git add .')
    initSpinner.stop()
    success('\n√ 初始化完成!')
  } catch (e) {
    error(e)
    initSpinner.stop()
  }
}
