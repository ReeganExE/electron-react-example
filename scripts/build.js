
'use strict'

process.env.NODE_ENV = 'production'
/*
  build script
 */

const path = require('path')
const yargs = require('yargs')
const webpack = require('webpack')
const fse = require('fs-extra')
const config = require('./config')

const webpackMainConfig = require('./webpack/webpack.config.main')
const webpackRendererConfig = require('./webpack/webpack.config.renderer')

const runWebpack = require('./utils/runWebpack')

// build
const build = async () => {
  console.log(`\nbuild start .....\n`)

  const mainConfig = webpackMainConfig()
  const rendererConfig = webpackRendererConfig()
  await runWebpack([mainConfig, rendererConfig])

  console.log(`\nbuild end .....\n`)
}

build()
  .catch(err => console.log(err))
