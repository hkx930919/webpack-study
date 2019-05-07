const { warning } = require('../../utils/tools')
const { cliNpmName } = require('../../utils/constant')
const { isHljProject, getProjectType } = require('../../utils/hlj')

module.exports = async function() {
  if (!isHljProject()) {
    return warning(`\n 此项目不是一个 ${cliNpmName} 创建的项目，无法使用该命令`)
  }
  const projectType = getProjectType()
  switch (projectType) {
    case 'vue':
      require('./vue')()
      break
    case 'react':
      require('./react')()
      break
    case 'react-admin':
      require('./react-admin')()
  }
}
