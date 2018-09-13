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

let oldUuid
let uuid
let app

describe('express-correlation-id', () => {

  beforeEach((done) => {
    app = express()
    app.use(setCorrelationId())
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
        done()
      })
  })

  it('with X-Correlation-ID', (done) => {
    app = express()
    app.use(setCorrelationId('X-Correlation-ID'))
    app.get('/', (req, res) => {
      expect(req).to.be.an('object')
      expect(req.id).to.exist
      expect(req.id).to.match(uuidV4Regex)
      uuid = req.id
      res.send('Hello World')
    })

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
        expect(res.headers['x-request-id']).to.match(uuidV4Regex)
        expect(res.headers['x-request-id']).to.be.equal(uuid)
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
        expect(res.headers['x-request-id']).to.match(uuidV4Regex)
        expect(res.headers['x-request-id']).to.be.equal(uuid)
        expect(res.headers['x-request-id']).to.not.equal(oldUuid)
        done()
      })
  })

  it('with custom X-Request-ID format', (done) => {
    app = express()
    app.use(setCorrelationId((id) => `foo:${id}:bar`))
    app.get('/', (req, res) => {
      expect(req).to.be.an('object')
      expect(req.id).to.exist
      uuid = req.id
      res.send('Hello World')
    })

    request(app)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.a('null')
        expect(res).to.be.an('object')
        expect(res.headers).to.be.an('object')
        expect(res.headers['x-request-id']).to.be.equal(uuid)
        expect(res.headers['x-request-id']).to.contain('foo:')
        expect(res.headers['x-request-id']).to.contain(':bar')
        done()
      })
  })

  it('will reuse the header if provided in the request', (done) => {
    app = express()
    app.use((req, res, next) => {
      req.headers['custom-header'] = 'super'
      next()
    })
    app.use(setCorrelationId('custom-header'))
    app.get('/', (req, res) => {
      expect(req).to.be.an('object')
      expect(req.id).to.exist
      uuid = req.id
      res.send('Hello World')
    })

    request(app)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.a('null')
        expect(res).to.be.an('object')
        expect(res.headers).to.be.an('object')
        expect(res.headers['custom-header']).to.be.equal(uuid)
        expect(res.headers['custom-header']).to.be.equal('super')
        done()
      })
  })
})
