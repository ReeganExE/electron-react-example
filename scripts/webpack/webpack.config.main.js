
'use strict'
/*
  webpack server config
 */
const path = require('path')
const fse = require('fs-extra')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = require('../config')
const packageJson = require(path.resolve('./package.json'))

// webpack server config
module.exports = function webpackServerConfig(name, argv) {
  const dev = process.env.NODE_ENV === 'development'

  return {
    entry: path.resolve(`./src/main`),
    mode: dev ? 'development' : 'production',
    output: {
      path: config.dist,
      publicPath: '/',
      filename: 'main.js',
      libraryTarget: 'commonjs',
      chunkFilename: `main/[name].js`
    },
    optimization: {
      minimizer: []
    },
    externals: Object.keys(packageJson.dependencies),
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            babelrc: false,
            cacheDirectory: false,
            presets: [
              [require.resolve('@babel/preset-env'), {
                targets: {
                  node: 'current'
                }
              }],
              require.resolve('@babel/preset-react')
            ],
            plugins: [
              require.resolve('@babel/plugin-transform-runtime'),
              require.resolve('@babel/plugin-proposal-object-rest-spread'),
              require.resolve('@babel/plugin-proposal-class-properties'),
              require.resolve('@babel/plugin-syntax-dynamic-import'),
              [require.resolve('babel-plugin-styled-components'), {
                ssr: true
              }],
              require.resolve('react-hot-loader/babel'),
              require.resolve('react-loadable/babel')
            ]
          }
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: dev ? 1024 * 100 : 1024 * 8,
            name: `static/images/[name]${dev ? '' : '.[hash:8]'}.[ext]`
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          query: {
            limit: dev ? 1024 * 100 : 1024 * 8,
            name: `static/fonts/[name]${dev ? '' : '.[hash:8]'}.[ext]`
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.RUNTIME_ENV': JSON.stringify('main'),
        'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production')
      }),
      ...dev ? [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
      ] : []
      // ,
      // new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })

    ],
    context: __dirname,
    node: {
      __filename: false,
      __dirname: false
    },
    devtool: dev ? 'cheap-module-source-map' : false
  }
}
