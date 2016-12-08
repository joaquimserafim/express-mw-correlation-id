/*
eslint
no-multi-spaces: ["error", {exceptions: {"VariableDeclarator": true}}]
padded-blocks: ["error", {"classes": "always"}]
max-len: ["error", 80]
*/
'use strict'

const uuid = require('uuid/v4')

module.exports = setCorrelationId

function setCorrelationId (header = false) {

  return setCorrelationIdMw

  function setCorrelationIdMw (req, res, next) {
    req.id = uuid()
    res.setHeader(header && 'X-Correlation-ID' || 'X-Request-ID', req.id)
    next()
  }
}
