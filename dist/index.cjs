
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./index.cjs.production.min.cjs')
} else {
  module.exports = require('./index.cjs.development.cjs')
}
