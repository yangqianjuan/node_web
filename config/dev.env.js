'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MOCK: false,
  BASE_API: '"http://test.store.xmartmonkey.com/manage/"'
  // BASE_API: '"http://192.168.10.73:8700/manage"'
})
