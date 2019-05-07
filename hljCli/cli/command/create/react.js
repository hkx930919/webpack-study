const { join } = require('path')
const fs = require('fs-extra')
const { info, success, error, getSpinner, installDep } = require('../../utils/tools')
const { shell } = require('execa')
const { setPkgJson } = require('../../utils/hlj')
const { reactTplGitPath, reactServerNpmName } = require('../../utils/constant')

module.exports = async function createProject(projectName) {
  const cwd = process.cwd()
  const projectPath = join(cwd, projectName)
  let generateSpinner = getSpinner('正在创建... ')
  try {
    info(`\n 开始创建 '${projectName}' 工程,请稍等...`)
    generateSpinner.start()
    await shell(`git clone -b master ${reactTplGitPath} ${projectName}`)
    await fs.remove(join(projectPath, '.git'))
    setPkgJson(projectName, reactServerNpmName)
    await installDep(projectPath)
    generateSpinner.stop()
    success('\n √ 创建成功,执行以下命令,启动项目')
    success(`\n $ cd ${projectName}`)
    success('\n $ npm start or yarn start')
  } catch (e) {
    generateSpinner.stop()
    error(e)
  }
}
