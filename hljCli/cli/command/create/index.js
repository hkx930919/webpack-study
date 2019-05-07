const inquirer = require('inquirer')

module.exports = async function() {
  let projectName = process.argv[3] || ''
  if (!projectName.trim()) {
    const { _projectName } = await inquirer.prompt([
      {
        type: 'input',
        message: '你想创建的工程名称?：',
        name: '_projectName',
        validate(val) {
          return val.trim() ? true : '\n请输入工程名称'
        }
      }
    ])
    projectName = _projectName
  }
  let { projectType } = await inquirer.prompt([
    {
      default: 'simple',
      type: 'list',
      message: '请选择需要创建的工程类型',
      name: 'projectType',
      choices: ['vue', 'react']
    }
  ])
  switch (projectType) {
    case 'vue':
      require('./vue')(projectName)
      break
    case 'react':
      require('./react')(projectName)
  }
}

