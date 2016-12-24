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
let oldUuid
let uuid
let app

describe('express-correlation-id', () => {

  beforeEach((done) => {
    app = express()
    app.use(setCorrelationId(header))
    app.get('/', (req, res) => {
      expect(req).to.be.an('object')
      expect(req.id).to.exist
      expect(req.id).to.match(uuidV4Regex)
      uuid = req.id
      res.send('Hello World')
    })
    done()
  })

  it('with X-Request-ID', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.a('null')
        expect(res).to.be.an('object')
        expect(res.headers).to.be.an('object')
        expect(res.headers['x-request-id']).to.match(uuidV4Regex)
        expect(res.headers['x-request-id']).to.be.equal(uuid)
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
        expect(res.headers['x-correlation-id']).to.be.equal(uuid)
        expect(res.headers['x-request-id']).to.not.exist
        oldUuid = res.headers['x-correlation-id']
        done()
      })
  })

  it('should always create a new value', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.a('null')
        expect(res).to.be.an('object')
        expect(res.headers).to.be.an('object')
        expect(res.headers['x-correlation-id']).to.match(uuidV4Regex)
        expect(res.headers['x-correlation-id']).to.be.equal(uuid)
        expect(res.headers['x-request-id']).to.not.exist
        expect(res.headers['x-correlation-id']).to.not.equal(oldUuid)
        done()
      })
  })

  it('req.id should exist', (done) => {
    app.get('/id', (req, res) => {
      expect(req).to.be.an('object')
      expect(req.id).to.exist
      expect(req.id).to.match(uuidV4Regex)
      uuid = req.id
      res.send('req.id should exists')
    })

    request(app)
      .get('/id')
      .end((err, res) => {
        expect(err).to.be.a('null')
        expect(res).to.be.an('object')
        expect(res.headers).to.be.an('object')
        expect(res.headers['x-correlation-id']).to.match(uuidV4Regex)
        expect(res.headers['x-correlation-id']).to.be.equal(uuid)
        expect(res.headers['x-request-id']).to.not.exist
        expect(res.headers['x-correlation-id']).to.not.equal(oldUuid)
        done()
      })
  })
})
