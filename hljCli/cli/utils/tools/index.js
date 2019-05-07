const { shellSync, shell } = require('execa')
const chalk = require('chalk')
const Spinner = require('cli-spinner').Spinner
const fs = require('fs-extra')
const { join } = require('path')
const { __root, __nodeModules, __packageLock } = require('../paths')

function hasYarn() {
  try {
    shellSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    shell('npm install yarn -g')
    return false
  }
}

function getSpinner(title, spinnerText) {
  let _spinner = new Spinner(title)
  _spinner.setSpinnerString(spinnerText || '|/-\\')
  return _spinner
}
function chalkLog(type, text, isExit) {
  console.log(chalk[type](text))
  isExit && process.exit()
}
function error(t, isExit = true) {
  chalkLog('red', t, isExit)
}
function success(t, isExit) {
  chalkLog('green', t, isExit)
}
function warning(t, isExit) {
  chalkLog('yellow', t, isExit)
}
function info(t, isExit) {
  chalkLog('gray', t, isExit)
}

// 安装依赖
async function installDep(projectPath, isRemoveNM = true) {
  if (typeof projectPath === 'boolean') {
    isRemoveNM = projectPath
    projectPath = null
  }
  projectPath = projectPath || __root
  const yarnLockPath = join(projectPath, 'yarn.lock')
  if (isRemoveNM && fs.pathExistsSync(__nodeModules)) {
    await fs.remove(__nodeModules)
  }
  if (fs.pathExistsSync(__packageLock)) {
    await fs.remove(__packageLock)
  }
  if (fs.pathExistsSync(yarnLockPath)) {
    await fs.remove(yarnLockPath)
  }
  try {
    await shell(`cd ${projectPath} && ${hasYarn() ? 'yarn' : 'npm i'}`)
  } catch (e) {
    await shell(`cd ${projectPath} && npm i`)
  }
}

module.exports = {
  hasYarn,
  error,
  warning,
  success,
  info,
  getSpinner,
  installDep
}
