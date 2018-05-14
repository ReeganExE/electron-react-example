
'use strict'

/*
  watch client
 */
const path = require('path')
const webpack = require('webpack')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const fse = require('fs-extra')

const config = require('../config')
const webpackRendererConfig = require('../webpack/webpack.config.renderer')

// watch renderer
module.exports = () => {
  return new Promise((resolve, reject) => {
    const rendererConfig = webpackRendererConfig()
    const rendererCompiler = webpack(rendererConfig)
    const devConfig = {
      publicPath: rendererConfig.output.publicPath,
      noInfo: false,
      quiet: false,
      stats: 'minimal'
    }
    const devMiddleware = webpackDevMiddleware(rendererCompiler, devConfig)
    const hotMiddleware = webpackHotMiddleware(rendererCompiler)
    let isResolve = false

    rendererCompiler.plugin('done', () => {
      const fsd = devMiddleware.fileSystem
      const filePath = path.join(rendererConfig.output.path, 'view/index.html')
      if (fsd.existsSync(filePath)) {
        let index = fsd.readFileSync(filePath, 'utf-8')
        const indexPath = path.join(config.dist, 'index.html')
        fse.outputFileSync(indexPath, index, 'utf8')
      }

      if (!isResolve) {
        isResolve = true
        console.log('watch renderer is running....')
        resolve([devMiddleware, hotMiddleware])
      }
    })
  })
}
