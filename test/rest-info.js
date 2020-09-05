process.env.NODE_ENV = 'test'

const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')

const server = require('../server')
const { message } = require('../utils/helpers')

chai.use(chaiHttp)

const test = async (pathname = '') => chai.request(server).get(`/api/${pathname}`)

const keys = {
  endpoints: ['characters', 'locations', 'episodes'],
  info: ['count', 'pages', 'next', 'prev'],
}

describe('[REST][INFO] Endpoints list', () => {
  it('should GET a list of endpoints', async () => {
    const { body } = await test()

    expect(body).to.be.an('object')
    expect(Object.keys(body)).to.deep.equal(keys.endpoints)
  })
})

describe('[REST][INFO] Info Object', () => {
  it('should GET an Info object with determined keys', async () => {
    const { body } = await test('character')

    expect(body).to.be.an('object')
    expect(Object.keys(body.info)).to.deep.equal(keys.info)
    expect(body.info.count).to.be.an('number')
    expect(body.info.pages).to.be.an('number')
    expect(body.info.next).to.be.an('string')
    expect(body.info.prev).to.be.null
  })
})

describe('[REST] API 404', () => {
  it('should get an error message', async () => {
    const res = await test('wubbalubbadubdub')

    expect(res).to.have.status(404)
    expect(res.body).to.have.property('error').include(message.noPage)
  })
})
