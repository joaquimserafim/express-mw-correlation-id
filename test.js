/*
eslint
no-multi-spaces: ["error", {exceptions: {"VariableDeclarator": true}}]
padded-blocks: ["error", {"classes": "always"}]
max-len: ["error", 80]
*/
'use strict'

const express = require('express')
const request = require('supertest')
const mocha   = require('mocha')
const expect  = require('chai').expect

const it          = mocha.it
const describe    = mocha.describe
const beforeEach  = mocha.beforeEach

const setCorrelationId = require('./')

const uuidV4Regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[1-5]' +
  '[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', 'i')

let header = false
let app

describe('express-correlation-id', () => {

  beforeEach((done) => {
    app = express()
    app.use(setCorrelationId(header))
    app.get('/', (req, res) => { res.send('Hello World') })
    done()
  })

  it('with X-Request-ID', (done) => {
    request(app)
      .get('/')
      .expect('x-request-id', uuidV4Regex)
      .end((err, res) => {
        expect(err).to.be.a('null')
        expect(res).to.be.an('object')
        expect(res.headers).to.be.an('object')
        expect(res.headers['x-request-id']).to.match(uuidV4Regex)
        expect(res.headers['x-correlation-id']).to.not.exist
        // reset `header` config to use X-Correlation-ID
        header = true
        done()
      })
  })

  it('with X-Correlation-ID', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.a('null')
        expect(res).to.be.an('object')
        expect(res.headers).to.be.an('object')
        expect(res.headers['x-correlation-id']).to.match(uuidV4Regex)
        expect(res.headers['x-request-id']).to.not.exist
        done()
      })
  })
})
