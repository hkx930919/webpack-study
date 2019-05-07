#!/usr/bin/env bash
# 部署的环境有dev、pre、publish分别对应测试、预发、线上
env=$1
# 下载依赖 编译打包
yarn
node node_modules/@hlj/vue-server/bin/index build ENV=${env}