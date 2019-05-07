const fs = require('fs-extra')
const { join } = require('path')
const { shell } = require('execa')
const { installDep, getSpinner, warning, success, error } = require('../../utils/tools')
const { __pkgJson } = require('../../utils/paths')
const { vueServerNpmName } = require('../../utils/constant')
const { shouldUpdateHljServer } = require('../../utils/hlj')
module.exports = async function() {
  const serverVersion = shouldUpdateHljServer(vueServerNpmName)
  if (!serverVersion) {
    return warning('\n项目配置已经是最新的了，不需要升级了')
  }
  const updateSpinner = getSpinner('正在更新...')
  updateSpinner.start()
  try {
    const { stdout } = await shell(`npm view ${vueServerNpmName} version`)
    const pkgJson = require(__pkgJson)
    if (pkgJson.dependencies && pkgJson.dependencies[vueServerNpmName]) {
      delete pkgJson.dependencies[vueServerNpmName]
    }
    if (!pkgJson.devDependencies) {
      pkgJson.devDependencies = {}
    }
    pkgJson.devDependencies[vueServerNpmName] = stdout
    await fs.writeFile(__pkgJson, JSON.stringify(pkgJson, null, 2))
    await installDep()
    updateSpinner.stop()
    success(`\n√更新成功，此次更新到 ${serverVersion.latestVer} 版本，更新内容如下：`)
    const updateLogPath = join(process.cwd(), `node_modules/${vueServerNpmName}/update-log`)
    if (fs.pathExistsSync(updateLogPath)) {
      const res = fs.readFileSync(updateLogPath, 'utf8')
      success(res)
    }
  } catch (e) {
    if (serverVersion) {
      const { latestVer } = serverVersion
      warning(`\n更新失败，请尝试以下步骤来修复`)
      success(
        `\n  1：将项目根目录下package.json中的依赖 ${vueServerNpmName} 的版本号改为 ${latestVer}`
      )
      success(`\n  2：在工程根目录下执行 npm i 或 yarn 命令`)
    } else {
      error(e)
    }
  }
}
