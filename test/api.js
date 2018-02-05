/* eslint no-unused-vars: [error, { "varsIgnorePattern": "should" }] */
/* global it, describe */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server')
const should = chai.should();

chai.use(chaiHttp);

const { site } = require('../helpers')

describe('Generic API Endpoints', () => {

  describe('Endpoints list', () => {
    it('it should GET a list of endpoints', done => {
      chai.request(server)
        .get('/api')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('characters').include(`${site}/character`)
          res.body.should.have.property('locations').include(`${site}/location`)
          res.body.should.have.property('episodes').include(`${site}/episode`)
          done()
        })
    })
  })

})
