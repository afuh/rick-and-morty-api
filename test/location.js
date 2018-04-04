/* eslint no-unused-vars: [error, { "varsIgnorePattern": "should" }] */
/* global it, describe */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server')
const should = chai.should();

chai.use(chaiHttp);

const { message } = require('../helpers')

describe('Location Endpoints', () => {

  describe('/GET All locations', () => {
    it('should get all locations', done => {
      chai.request(server)
        .get('/api/location')
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

  describe('/GET Single location with id: 1', () => {
    it('should get one location with id: 1', done => {
      chai.request(server)
        .get('/api/location/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.id.should.be.eql(1);
          done()
        })
    })

    it('should have a keys', done => {
      chai.request(server)
        .get('/api/location/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          Object.keys(res.body).should.be.eql([
            'id',
            'name',
            'type',
            'dimension',
            'residents',
            'url',
            'created'
          ])

          done()
        })
    })
  })

  describe('/GET Single location with id: 12345', () => {
    it('should get an error message', done => {
      chai.request(server)
        .get('/api/location/12345')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('error').include(message.noLocation)
          done()
        })
    })
  })

  describe('/GET Single location with id: asdasd', () => {
    it('should get an error message', done => {
      chai.request(server)
        .get('/api/location/asdasd')
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('error').include(message.badParam)
          done()
        })
    })
  })

  describe('/GET ?name', () => {
    it('should get locations with name: Earth', done => {
      chai.request(server)
        .get('/api/location?name=Earth')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.forEach(char => {
            char.should.have.property('name').include('Earth')
          })
          done()
        })
    })
  })

  describe('/GET ?type', () => {
    it('should get locations with type: Planet', done => {
      chai.request(server)
        .get('/api/location?type=planet')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.forEach(char => {
            char.should.have.property('type').include('Planet')
          })
          done()
        })
    })
  })

  describe('/GET ?dimension', () => {
    it('should get locations with dimension: C-137', done => {
      chai.request(server)
        .get('/api/location?dimension=C-137')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.forEach(char => {
            char.should.have.property('dimension').include('C-137')
          })
          done()
        })
    })
  })

  describe('/GET ?name, ?type, ?dimension', () => {
    it('should get locations with name: Earth, type: Planet, dimension: C-137', done => {
      chai.request(server)
        .get('/api/location?name=earth&type=planet&dimension=c-137')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.forEach(char => {
            char.should.have.property('name').include('Earth')
            char.should.have.property('type').include('Planet')
            char.should.have.property('dimension').include('C-137')
          })
          done()
        })
    })
  })

  describe('/GET special characters', () => {
    it('should get location with name: (', done => {
      chai.request(server)
        .get('/api/character?name=(')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.forEach(char => {
            char.should.have.property('name').include('(')
          })
          done()
        })
    })

    it('should get characters with name: -', done => {
      chai.request(server)
        .get('/api/location?name=-')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.forEach(char => {
            char.should.have.property('name').include('-')
          })
          done()
        })
    })
  })

  describe('/GET ?page=1', () => {
    it('should get page: 1', done => {
      chai.request(server)
        .get('/api/location?page=1')
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
        .get('/api/location?page=2')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.info.prev.slice(-1).should.be.eql('1')
          res.body.info.next.slice(-1).should.be.eql('3')
          res.body.results.should.be.a('array')
          res.body.results.length.should.be.eql(20)
          res.body.results[0].id.should.be.eql(21);
          res.body.results[19].id.should.be.eql(40);
          done()
        })
    })
  })

  describe('/GET ?page=12345 ', () => {
    it('should get an error message', done => {
      chai.request(server)
        .get('/api/location?page=12345')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('error').include(message.noPage)
          done()
        })
    })
  })

})
