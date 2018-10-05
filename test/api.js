/* eslint no-unused-vars: [error, { "varsIgnorePattern": "should" }] */
/* global it, describe */

process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()

chai.use(chaiHttp)

const { site, message } = require('../utils/helpers')

describe('Generic API', () => {
  describe('Endpoints list', () => {
    it('should GET a list of endpoints', done => {
      chai.request(server)
        .get('/api')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('characters').include(`${site}/character`)
          res.body.should.have.property('locations').include(`${site}/location`)
          res.body.should.have.property('episodes').include(`${site}/episode`)
          done()
        })
    })
  })

  describe('Info Object', () => {
    it('should GET an Info object with determinated keys', done => {
      chai.request(server)
        .get('/api/character')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.info.should.be.a('object')
          Object.keys(res.body.info).should.be.eql([
            'count',
            'pages',
            'next',
            'prev'
          ])
          res.body.info.count.should.be.a('number')
          res.body.info.pages.should.be.a('number')
          res.body.info.next.should.be.a('string')
          res.body.info.prev.should.be.a('string')
          done()
        })
    })
  })

  describe('API 404', () => {
    it('should get an error message', done => {
      chai.request(server)
        .get('/api/wubbalubbadubdub')
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('error').include(message.noPage)
          done()
        })
    })
  })

  describe('Avatar redirect', () => {
    it('should redirect to /character', done => {
      chai.request(server)
        .get('/api/character/avatar')
        .end((err, res) => {
          res.should.redirect
          res.should.have.status(200)
          res.req.path.should.be.eql('/api/character/')
          done()
        })
    })
  })

})
