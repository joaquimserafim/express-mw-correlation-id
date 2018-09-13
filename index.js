/*
eslint
no-multi-spaces: ["error", {exceptions: {"VariableDeclarator": true}}]
padded-blocks: ["error", {"classes": "always"}]
max-len: ["error", 80]
*/
'use strict'

const uuid = require('uuid.v4')

module.exports = setCorrelationId

function setCorrelationId (name, formatter = (id) => id) {
  if (typeof name === 'function') {
    formatter = name
    name = null
  }

  return setCorrelationIdMw

  function setCorrelationIdMw (req, res, next) {
    const id = req.get(name || 'X-Request-ID')

    req.id = id || formatter(uuid())
    res.setHeader(name || 'X-Request-ID', req.id)
    next()
  }
}
