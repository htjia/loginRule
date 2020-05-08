'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.2.42:90/webviewserver"',
  // BASE_API: '"http://192.168.2.69:90/webview-server"',
  // BASE_API: '"http://192.168.2.72:100/webview-server"',
  // BASE_API: '"http://192.168.2.42:90/webviewserver"',
  // BASE_API: '"http://192.168.2.151:8080/webviewserver"',
})
