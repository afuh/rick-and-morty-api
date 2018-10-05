/* eslint no-unused-vars: [error, { "varsIgnorePattern": "should" }] */
/* global it, describe */

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()

chai.use(chaiHttp)

const { message } = require('../utils/helpers')

describe('Character Endpoints', () => {

  describe('/GET All characters', () => {
    it('should get all characters', done => {
      chai.request(server)
        .get('/api/character')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.length.should.be.eql(20)
          done()
        })
    })

    it('should be the same length as the info count', done => {
      chai.request(server)
        .get('/api/character')
        .end((err, res) => {
          res.should.have.status(200)
          const count = res.body.info.count
          const chars = Array.from({ length: count }, (v, i) => i + 1)

          chai.request(server)
            .get(`/api/character/${chars}`)
            .end((err, res) => {
              res.body.should.be.a('array')
              res.body.length.should.be.eql(count)
            })
          done()
        })
    })

    it('should have an image/jpeg that matches the char. ID', done => {
      chai.request(server)
        .get('/api/character')
        .end((err, res) => {
          res.should.have.status(200)
          const count = res.body.info.count
          const chars = Array.from({ length: count }, (v, i) => i + 1)

          chars.forEach(id => {
            chai.request(server)
            .get(`/api/character/avatar/${id}.jpeg`)
            .end((err, res) => {
              res.type.should.be.eql('image/jpeg')
            })
          })
          done()
        })
    })
  })

  describe('/GET Single character with id: 1', () => {
    it('should get one character with id: 1', done => {
      chai.request(server)
        .get('/api/character/1')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.id.should.be.eql(1)
          done()
        })
    })

    it('should have a keys', done => {
      chai.request(server)
      .get('/api/character/1')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        Object.keys(res.body).should.be.eql([
          'id',
          'name',
          'status',
          'species',
          'type',
          'gender',
          'origin',
          'location',
          'image',
          'episode',
          'url',
          'created'
        ])
        done()
      })
    })

  })

  describe('/GET five characters', () => {
    it('should get five characters with an array', done => {
      const chars = [1,2,3,4,5]
      chai.request(server)
        .get(`/api/character/${chars}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(chars.length)
          res.body.forEach(char => {
            chars.includes(char.id)
          })
          done()
        })
    })

    it('should get five characters with a string', done => {
      const chars = '1,2,3,4,5'
      chai.request(server)
        .get(`/api/character/${chars}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(chars.replace(/,/g, '').length)
          res.body.forEach(char => {
            chars.includes(char.id)
          })
          done()
        })
    })
  })

  describe('/GET Error messages', () => {
    it('should get an error message with id:12345', done => {
      chai.request(server)
        .get('/api/character/12345')
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('error').include(message.noCharacter)
          done()
        })
    })

    it('should get an error message with id:asdads', done => {
      chai.request(server)
        .get('/api/character/asdasd')
        .end((err, res) => {
          res.should.have.status(500)
          res.body.should.be.a('object')
          res.body.should.have.property('error').include(message.badParam)
          done()
        })
    })

    it('should get an error message with id:1,2]', done => {
      chai.request(server)
        .get('/api/character/1,2]')
        .end((err, res) => {
          res.should.have.status(500)
          res.body.should.be.a('object')
          res.body.should.have.property('error').include(message.badArray)
          done()
        })
    })

    it('should get an error message with id:[1,2', done => {
      chai.request(server)
        .get('/api/character/[1,2')
        .end((err, res) => {
          res.should.have.status(500)
          res.body.should.be.a('object')
          res.body.should.have.property('error').include(message.badArray)
          done()
        })
    })

    it('should get an error message with id:[1,asdasd]', done => {
      chai.request(server)
        .get('/api/character/[1,asdasd]')
        .end((err, res) => {
          res.should.have.status(500)
          res.body.should.be.a('object')
          res.body.should.have.property('error').include(message.badArray)
          done()
        })
    })
  })

  describe('/GET characters with single query', () => {
    it('should get characters with name: Rick', done => {
      chai.request(server)
        .get('/api/character?name=Rick')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.forEach(char => {
            char.should.have.property('name').include('Rick')
          })
          done()
        })
    })

    it('should get characters with status: Alive', done => {
      chai.request(server)
        .get('/api/character?status=alive')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.forEach(char => {
            char.should.have.property('status').include('Alive')
          })
          done()
        })
    })

    it('should get characters with status: Alien', done => {
      chai.request(server)
        .get('/api/character?species=alien')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.forEach(char => {
            char.should.have.property('species').include('Alien')
          })
          done()
        })
    })

    it('should get characters with type: Parasite', done => {
      chai.request(server)
        .get('/api/character?type=parasite')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.forEach(char => {
            char.should.have.property('type').include('Parasite')
          })
          done()
        })
    })

    it('should get characters with gender: Female', done => {
      chai.request(server)
        .get('/api/character?gender=female')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.forEach(char => {
            char.should.have.property('gender').include('Female')
          })
          done()
        })
    })
  })

  describe('/GET characters with multiple queries', () => {
    it('should get characters with name: Rick, stauts: Alive, gender: Male and species: Human', done => {
      chai.request(server)
        .get('/api/character?name=Rick&status=alive&gender=Male&species=Human')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.results.should.be.a('array')
          res.body.results.forEach(char => {
            char.should.have.property('name').include('Rick')
            char.should.have.property('status').include('Alive')
            char.should.have.property('gender').include('Male')
            char.should.have.property('species').include('Human')
          })

          done()
        })
    })
  })

  describe('/GET special characters', () => {
    it('should get characters with name: (', done => {
      chai.request(server)
        .get('/api/character?name=(')
        .end((err, res) => {
          res.should.have.status(200)
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
        .get('/api/character?name=-')
        .end((err, res) => {
          res.should.have.status(200)
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

  describe('/GET pages', () => {
    it('should get page: 1', done => {
      chai.request(server)
        .get('/api/character?page=1')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.info.prev.length.should.be.eql(0)
          res.body.info.next.slice(-1).should.be.eql("2")
          res.body.results.should.be.a('array')
          res.body.results.length.should.be.eql(20)
          res.body.results[0].id.should.be.eql(1)
          res.body.results[19].id.should.be.eql(20)
          done()
        })
    })

    it('should get page: 2', done => {
      chai.request(server)
        .get('/api/character?page=2')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.info.should.be.a('object')
          res.body.info.prev.slice(-1).should.be.eql('1')
          res.body.info.next.slice(-1).should.be.eql('3')
          res.body.results.should.be.a('array')
          res.body.results.length.should.be.eql(20)
          res.body.results[0].id.should.be.eql(21)
          res.body.results[19].id.should.be.eql(40)
          done()
        })
    })
  })

  describe('/GET ?page=12345 ', () => {
    it('should get an error message', done => {
      chai.request(server)
        .get('/api/character?page=12345')
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('error').include(message.noPage)
          done()
        })
    })
  })

})
