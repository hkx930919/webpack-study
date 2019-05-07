#!/usr/bin/env node --harmony
'use strict'
process.env.NODE_PATH = __dirname + '/../node_modules/'
const program = require('commander')
program.version(require('../package').version, '-v, --version')
program.usage('<command>')
program
  .command('create')
  .description('创建一个新工程')
  .alias('c')
  .action(() => {
    require('../command/create/index')()
  })
program
  .command('update')
  .description('更新工程配置')
  .alias('u')
  .action(() => {
    require('../command/update/index')()
  })
program
  .command('page')
  .description('为vue多页面工程创建一个页面')
  .alias('p')
  .action(() => {
    require('../command/page/index')()
  })
program
  .command('init')
  .description('初始化一个空的工程')
  .alias('i')
  .action(() => {
    require('../command/init/index')()
  })
program
  .command('route')
  .description('为vue多页面工程中的某个页面创建一个路由')
  .alias('r')
  .action(() => {
    require('../command/route/index')()
  })
program.parse(process.argv)
if (!program.args.length) {
  program.help()
}
