
'use strict'

/*
  watch client
 */
const webpack = require('webpack')
const path = require('path')
const config = require('../config')
const webpackMainConfig = require('../webpack/webpack.config.main')
const runWebpack = require('./runWebpack')

// watch main
module.exports = async () => {
  const mainConfig = webpackMainConfig()
  const mainPath = path.join(mainConfig.output.path, mainConfig.output.filename)
  await runWebpack(mainConfig)
  return mainPath
}
