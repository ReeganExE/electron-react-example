const webpack = require('webpack')

module.exports = (webpackConfig) => {
  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig)
    // compiler.apply(new ProgressPlugin())
    compiler.run((err, stats) => {
      if (err) {
        reject(err)
        return
      }
      const info = stats.toJson()
      if (stats.hasErrors()) {
        info.warnings.forEach(err => console.error(err))
      }

      if (stats.hasWarnings()) {
        info.warnings.forEach(err => console.warn(err + '\n'))
      }

      process.stdout.write(stats.toString({
        chunks: false,
        colors: true
      }))

      resolve()
    })
  })
}
