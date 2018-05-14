
'use strict'
/*
  electron renderer processes webpack config
 */
const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = require('../config')
const packageJson = require(path.resolve('./package.json'))

module.exports = function webpackClientConfig() {
  const dev = process.env.NODE_ENV === 'development'

  return {
    mode: dev ? 'development' : 'production',
    entry: dev ? [
      `webpack-hot-middleware/client?reload=true&path=${config.host}/__webpack_hmr`,
      path.resolve(`./src/renderer`)
    ] : path.resolve(`./src/renderer`),
    output: {
      path: config.dist,
      publicPath: dev ? `${config.host}/` : './',
      filename: `static/scripts/[name]${dev ? '' : '.[contenthash]'}.js`,
      chunkFilename: `static/scripts/[name]${dev ? '' : '.[contenthash]'}.js`
    },
    optimization: dev ? undefined : {
      runtimeChunk: {
        name: 'manifest'
      },
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true
            }
          },
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            safe: true,
            discardComments: {removeAll: true}
          }
        })
      ]
    },
    resolve: {
      modules: [
        path.resolve('./node_modules')
      ]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          loader: 'eslint-loader',
          include: [path.resolve('./src')],
          exclude: /node_modules/,
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        },
        {
          test: /\.js$/,
          include: [path.resolve('./src')],
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
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
      new HtmlWebpackPlugin({
        filename: dev ? 'view/index.html' : './index.html',
        template: path.resolve(`./src/index.html`)
      }),
      new webpack.LoaderOptionsPlugin({
        debug: dev
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve('src', 'public'),
          to: dev ? '' : 'public'
        }
      ]),
      new webpack.DefinePlugin({
        'process.env.RUNTIME_ENV': JSON.stringify('renderer'),
        'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production')
      }),
      new MiniCssExtractPlugin({
        filename: `static/styles/[name]${dev ? '' : '.[contenthash]'}` + '.css'
      }),
      ...dev ? [
        new webpack.HotModuleReplacementPlugin()
      ] : []
    ],
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    cache: dev,
    target: 'web',
    devtool: dev ? 'cheap-module-source-map' : 'source-map'
  }
}
