## 使用依赖说明

- "chalk": 界面输出的颜色更好看点
  > console.log(chalk.green('Added successfully!\n'))
  > console.log(chalk.grey('The latest template list is: \n'))
- "commander":编写指令和处理命令行

  ```
  const program = require("commander");
  // 定义指令
  program
  .version('0.0.1')
  .command('init', 'Generate a new project from a template')
  .action(() => {
      // 回调函数
  })

  ```

- "download-git-repo": 下载远程模板

  ```
  const download = require('download-git-repo')
  download(repository, destination, options, callback)
  ```

- "inquirer": 交互式命令行工具,比原生的好用

  ```
    const inquirer = require('inquirer');

    inquirer
    .prompt([
    // 一些交互式的问题
    ])
    .then(answers => {
    // 回调函数，answers 就是用户输入的内容，是个对象
    });
  ```

* "ora": 好看的加载

  ```
  const ora = require('ora')
  let spinner = ora('downloading template ...')
  spinner.start()
  ```
