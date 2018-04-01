/* eslint no-unused-vars: [error, { "varsIgnorePattern": "should" }] */
/* global it, describe */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server')
const should = chai.should();

chai.use(chaiHttp);

const { message } = require('../helpers')

describe('Episode Endpoints', () => {

  describe('/GET All episodes', () => {
    it('should get all episodes', done => {
      chai.request(server)
        .get('/api/episode')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.length.should.be.eql(20)
          done()
        })
    })
  })

  describe('/GET Single episode with id: 1', () => {
    it('should get one episode with id: 1', done => {
      chai.request(server)
        .get('/api/episode/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.id.should.be.eql(1);
          done()
        })
    })

    it('should have a keys', done => {
      chai.request(server)
        .get('/api/episode/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(res.body).should.be.eql([
            'id',
            'name',
            'air_date',
            'episode',
            'characters',
            'url',
            'created'
          ])
          done()
        })
    })
  })

  describe('/GET Single episode with id: 12345', () => {
    it('should get an error message', done => {
      chai.request(server)
        .get('/api/episode/12345')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('error').include(message.noEpisode)
          done()
        })
    })
  })

  describe('/GET Single episode with id: asdasd', () => {
    it('should get an error message', done => {
      chai.request(server)
        .get('/api/episode/asdasd')
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('error').include(message.badParam)
          done()
        })
    })
  })

  describe('/GET ?name', () => {
    it('should get episodes with name: Pilot', done => {
      chai.request(server)
        .get('/api/episode?name=Pilot')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.forEach(char => {
            char.should.have.property('name').include('Pilot')
          })
          done()
        })
    })
  })

  describe('/GET ?episode', () => {
    it('should get episodes with episode: S01E01', done => {
      chai.request(server)
        .get('/api/episode?episode=S01E01')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.info.count.should.be.eql(1)
          res.body.results.should.be.a('array')
          res.body.results[0].should.have.property('episode').include('S01E01')
          done()
        })
    })
  })

  describe('/GET ?page=1', () => {
    it('should get page: 1', done => {
      chai.request(server)
        .get('/api/episode?page=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.info.prev.length.should.be.eql(0)
          res.body.info.next.slice(-1).should.be.eql('2')
          res.body.results.should.be.a('array')
          res.body.results.length.should.be.eql(20)
          res.body.results[0].id.should.be.eql(1);
          res.body.results[19].id.should.be.eql(20);
          done()
        })
    })
  })

  describe('/GET ?page=2', () => {
    it('should get page: 2', done => {
      chai.request(server)
        .get('/api/episode?page=2')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.info.prev.slice(-1).should.be.eql('1')
          res.body.info.next.length.should.be.eql(0)
          res.body.results.should.be.a('array')
          res.body.results[0].id.should.be.eql(21);
          done()
        })
    })
  })

  describe('/GET ?page=12345 ', () => {
    it('should get an error message', done => {
      chai.request(server)
        .get('/api/episode?page=12345')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('error').include(message.noPage)
          done()
        })
    })
  })

})
