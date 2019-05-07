const { join } = require('path')
const fs = require('fs-extra')
const glob = require('glob')

// 删除page模本文件夹
async function delPageTplDir() {
  await fs.remove(join(__dirname, '../../template'))
}

// 获取page模板列表
function getPageTplList() {
  const list = []
  glob.sync('src/*', { cwd: join(__dirname, '../../template') }).forEach(name => {
    name = name.substring(4)
    if (!['static', '__BASE__'].includes(name)) {
      const des = getPageDescribe(name)
      list.push(name + (des ? ` --> ${des}` : ''))
    }
  })
  return list
}
// 获取page备注信息
function getPageDescribe(pageName) {
  let pagePath = join(__dirname, `../../template/page/${pageName}.html`)
  try {
    if (fs.pathExistsSync(pagePath)) {
      const html = fs.readFileSync(pagePath, 'utf8')
      const reg = /<title\s*>([\s\S]*)<\/title\s*>/gi
      let describe = ''
      html.replace(reg, () => {
        describe = RegExp.$1
      })
      if (describe) {
        describe = describe.replace(/\n/g, '')
        if (describe.length > 30) {
          describe = describe.substring(0, 30) + '...'
        }
      }
      return describe
    }
  } catch (e) {
    return ''
  }
}

// page是否存在，包括page或src文件夹下存在相同名字就表示存在
function isPageExist(pageName) {
  const cwd = process.cwd()
  return (
    !!pageName &&
    (fs.pathExistsSync(join(cwd, `page/${pageName}.html`)) || fs.pathExistsSync(join(cwd, `src/${pageName}`)))
  )
}
// 模本是否存在
function isPageTplExist(pageTpl) {
  const list = getPageTplList()
  return list.includes(pageTpl)
}

function getPageTplPath(pageTpl) {
  return {
    __html: join(__dirname, `../../template/page/${pageTpl}.html`),
    __src: join(__dirname, `../../template/src/${pageTpl}`)
  }
}

//将驼峰模块名称转换为xxx-xxx的形式
function formatPageName(name) {
  name = (name || '').trim()
  if (!name) {
    return ''
  }
  if (name.charAt(0) === '/') {
    name = name.substring(1)
  }
  if (name.charAt(name.length - 1) === '/') {
    name = name.substring(0, name.length - 1)
  }
  return name
    .split('/')
    .map(item => {
      item = item.charAt(0).toLocaleLowerCase() + item.substring(1)
      return item
        .replace(/([A-Z])/g, '-$1')
        .trim()
        .toLowerCase()
    })
    .join('/')
}

module.exports = {
  delPageTplDir,
  getPageTplList,
  getPageDescribe,
  isPageExist,
  isPageTplExist,
  getPageTplPath,
  formatPageName
}
