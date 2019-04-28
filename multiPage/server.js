/**
 * * 使用node写一个开发环境的server,不会自动刷新浏览器
 */
const express = require('express')
const webpack = require('webpack')
const devMiddle = require('webpack-dev-middleware')
const config = require('./webpack.config.js')

const app = express()
const compiler = webpack(config)
/** 
 * !利用这中间件
 */
app.use(devMiddle(compiler,{
    publicPath:config.output.publicPath||'/'
}))

app.listen(3001,()=>{
    console.log('服务启动了。。。。');
})

