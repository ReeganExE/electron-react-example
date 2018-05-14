const path = require('path')
// temp build dirname
module.exports = {
  dist: process.env.NODE_ENV !== 'production'
    ? path.resolve('./node_modules/.electorn-cache')
    : path.resolve('./dist'),
  host: 'http://localhost:35829'
}
