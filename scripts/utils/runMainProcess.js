
'use strict'

/*
  run server
 */
const path = require('path')
const spawn = require('cross-spawn')

let server

// run server
module.exports = function runMainProcess(mainPath) {
  return new Promise((resolve, reject) => {
    if (server) {
      server.kill('SIGTERM')
    }

    server = spawn('electron', [mainPath], {
      env: process.env,
      silent: false
    })

    let isResolve = false
    let timeId = null
    let serverStdoutHandle = data => {
      timeId && clearTimeout(timeId)
      if (!isResolve) {
        console.log('main process is running...')
        isResolve = true
        resolve()
      }
      process.stdout.write(data)
    }

    server.stdout.on('data', data => serverStdoutHandle(data))
    server.stderr.on('data', err => process.stderr.write(err))
  })
}

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM')
  }
})
