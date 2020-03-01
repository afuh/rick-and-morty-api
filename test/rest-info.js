process.env.NODE_ENV = 'test'

const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

const { message } = require('../utils/helpers')

const test = async (pathname = '') => chai.request(server).get(`/api/${pathname}`)

const keys = {
  endpoints: ['characters', 'locations', 'episodes'],
  info: ['count', 'pages', 'next', 'prev']
}

describe('Endpoints list', () => {
  it('should GET a list of endpoints', async () => {
    const { body } = await test()

    expect(body).to.be.an('object')
    expect(Object.keys(body)).to.deep.equal(keys.endpoints)
  })
})

describe('Info Object', () => {
  it('should GET an Info object with determinated keys', async () => {
    const { body } = await test('character')

    expect(body).to.be.an('object')
    expect(Object.keys(body.info)).to.deep.equal(keys.info)
    expect(body.info.count).to.be.an('number')
    expect(body.info.pages).to.be.an('number')
    expect(body.info.next).to.be.an('string')
    expect(body.info.prev).to.be.an('string')
  })
})

describe('API 404', () => {
  it('should get an error message', async () => {
    const res = await test('/wubbalubbadubdub')

    expect(res).to.have.status(404)
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('error').include(message.noPage)
  })
})

describe('Avatar redirect', () => {
  it('should redirect to /character', async () => {
    const res = await test('/character/avatar')

    expect(res).to.redirect
    expect(res.req.path).to.equal('/api/character/')
  })
})
