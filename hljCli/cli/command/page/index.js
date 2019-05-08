const fs = require('fs-extra')
const { join } = require('path')
const inquirer = require('inquirer')
const { shell } = require('execa')
const { getSpinner, success, error, warning } = require('../../utils/tools')
const {
  isPageExist,
  getPageTplList,
  delPageTplDir,
  getPageTplPath,
  formatPageName
} = require('../../utils/page')
const { setPageNameOfHljConfig, getProjectType } = require('../../utils/hlj')
const { vuePageGitPath } = require('../../utils/constant')
const type = getProjectType()
module.exports = async function() {
  if (type !== 'vue') {
    return warning(`\n page 命令目前只适用于cli创建的vue多页面工程`)
  }

  let pageName = process.argv[3] || ''
  if (!pageName.trim()) {
    const { _pageName } = await inquirer.prompt([
      {
        type: 'input',
        message: '请输入页面名称：',
        name: '_pageName',
        validate(val = '') {
          val = val.trim().toLowerCase() || '__base__'
          if (['static', '__base__'].includes(val)) {
            return '你必须提供一个有效的名字'
          }
          return true
        }
      }
    ])
    pageName = formatPageName(_pageName)
  }
  await createPage(pageName)
}
async function createPage(pageName) {
  const cwd = process.cwd()
  if (['__BASE__', 'static'].includes(pageName)) {
    return warning(`\n页面名称 ${pageName} 无效，不得以__BASE__或static命名`)
  }
  if (isPageExist(pageName)) {
    return warning(`\n页面 ${pageName} 已经存在`)
  }
  const createSpinner = getSpinner('正在创建... ')
  createSpinner.start()
  try {
    await delPageTplDir()
    await shell(
      `git clone -b master ${vuePageGitPath} ${join(
        __dirname,
        '../../template'
      )}`
    )
    const list = getPageTplList()
    createSpinner.stop()
    if (!list.length) {
      await delPageTplDir()
      error('没有对应的页面模板')
    }
    let { pageTpl } = await inquirer.prompt([
      {
        default: 'simple',
        type: 'list',
        message: `请选择一个页面模板来创建项目`,
        name: 'pageTpl',
        choices: list
      }
    ])
    const targetPagePath = join(cwd, 'page')
    const targetSrcPath = join(cwd, 'src')
    const { __html, __src } = getPageTplPath(
      pageTpl.substring(0, pageTpl.indexOf('-->')).trim()
    )
    await fs.copy(__html, join(targetPagePath, pageName + '.html'))
    await fs.copy(__src, join(targetSrcPath, pageName))
    setPageNameOfHljConfig(pageName, true)
    try {
      await shell('git add .')
    } catch (e) {
      error('当前工程不是一个git工程')
    }
    await delPageTplDir()
    success(`\n √ 工程页面 '${pageName}' 创建完成!`)
  } catch (e) {
    createSpinner.stop()
    await delPageTplDir()
    error(e)
  }
}
