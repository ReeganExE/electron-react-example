
'use strict'

process.env.NODE_ENV = 'development'
/*
  start script
  */
const path = require('path')
const fse = require('fs-extra')
const browserSync = require('browser-sync')

const config = require('./config')
const watchMain = require('./utils/watchMain')
const watchRenderer = require('./utils/watchRenderer')
const runMainProcess = require('./utils/runMainProcess')

// start
const start = async () => {
  // 删除临时文件
  await fse.remove(config.dist)

  // 渲染进程编译
  const middleware = await watchRenderer()

  // 主进程编译
  let mainPath = await watchMain()

  // 启动代理服务
  const bs = browserSync.create()
  bs.init({
    ui: false,
    open: false,
    port: 35829,
    cors: true,
    notify: false,
    middleware
  }, (err, bs) => {
    if (err) {
      console.log(err)
    }
    runMainProcess(mainPath)
  })
}

start()
  .then(() => {
    console.log('dev start...')
  })
  .catch(err => console.log(err))
