const { success } = require('../../utils/tools')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const { __hljConfig, __src } = require('../../utils/paths')
const { isPageExist } = require('../../utils/page')
const { getProjectType } = require('../../utils/hlj')
const { join } = require('path')
const type = getProjectType()
function verifyPage(page) {
  if (typeof page === 'string' && page !== '*') {
    if (page.startsWith('#') || page.startsWith('!')) {
      return page.substring(1)
    }
    return page
  }
  return ''
}
function isRouteExists(page, route) {
  return route && fs.pathExistsSync(join(__src, `${page}/views/${route}`))
}
module.exports = async function() {
  if (type !== 'vue') {
    return warning(`\n route 命令目前只适用于cli创建的vue多页面工程`)
  }
  let routeName = (process.argv[3] || '').trim()
  let pageName = (process.argv[4] || '').trim()
  if (!pageName) {
    let { page } = require(__hljConfig)
    if (Array.isArray(page)) {
      page = page.length === 1 ? page[0] : ''
    }
    pageName = verifyPage(page)
  }
  if (!isPageExist(pageName)) {
    const { _pageName } = await inquirer.prompt([
      {
        type: 'input',
        message: pageName ? `页面'${pageName}'不存在，重新输入：` : '你需要给哪个页面创建路由：',
        name: '_pageName',
        validate(val = '') {
          val = val.trim().toLowerCase()
          if (!val.trim().toLowerCase()) {
            return '你必须提供一个有效的页面名称'
          }
          if (!isPageExist(val)) {
            return `页面 '${val}' 不存在`
          }
          return true
        }
      }
    ])
    pageName = _pageName
  } else {
    const { _pageName } = await inquirer.prompt([
      {
        type: 'input',
        message: `即将为页面 ${pageName} 创建路由，你仍然可以再次修改：`,
        name: '_pageName',
        default: pageName,
        validate(val = '') {
          val = val.trim().toLowerCase()
          if (!val.trim().toLowerCase()) {
            return '你必须提供一个有效的页面名称'
          }
          if (!isPageExist(val)) {
            return `页面 '${val}' 不存在`
          }
          return true
        }
      }
    ])
    pageName = _pageName
  }
  if (!routeName || isRouteExists(pageName, routeName)) {
    const { _routeName } = await inquirer.prompt([
      {
        type: 'input',
        message: routeName ? '该路由已存在，请重新输入：' : '路由名称：',
        name: '_routeName',
        validate(val = '') {
          val = val.trim().toLowerCase()
          if (!val.trim().toLowerCase()) {
            return '你必须提供一个有效的路由名称'
          }
          if (fs.pathExistsSync(join(__src, `${pageName}/views/${val}`))) {
            return '该路由已存在'
          }
          return true
        }
      }
    ])
    routeName = _routeName
  }
  await createRoute(pageName, routeName)
}
async function createRoute(pageName, routeName) {
  const routePath = join(__src, pageName, 'router/index.js')
  if (fs.pathExistsSync(routePath)) {
    let routeInfo = fs.readFileSync(routePath, 'utf8')
    const reg = /routes\s*:\s*\[([\s\S]*)\]/g
    if (reg.test(routeInfo)) {
      routeInfo = routeInfo.replace(reg, () => {
        let flag = RegExp.$1.trim().endsWith(',')
        return `routes: [
    ${RegExp.$1.trim()}${flag ? '' : ','}
    {
      path: '/${routeName}',
      name: '${routeName}',
      meta: {
        title: '${routeName}'
      },
      component: () => import(/* webpackChunkName: "${pageName}/route.${routeName}" */'../views/${routeName}')
    }
   ]`
      })
      fs.writeFileSync(routePath, routeInfo)
      fs.copySync(
        join(__dirname, '../../example/src/views/index'),
        join(__src, `${pageName}/views/${routeName}`)
      )
      success(`\n路由 '${routeName}' 创建完成！`)
    }
  }
}
