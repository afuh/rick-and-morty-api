process.env.NODE_ENV = 'test'

const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

const test = async query => {
  const res = await chai.request(server)
    .post('/graphql')
    .set('content-type', 'application/json')
    .send({ query })

  return res.body.data
}

const keys = ['count', 'pages', 'next', 'prev']

describe('Graphql: Info', async () => {
  it('Gets info about allCharacters', async () => {
    const query = `{ allCharacters { info { count } } }`
    const { allCharacters: { info } } = await test(query)

    expect(info).to.be.an('object')
  })

  it('Gets info about allLocations', async () => {
    const query = `{ allLocations { info { count } } }`
    const { allLocations: { info } } = await test(query)

    expect(info).to.be.an('object')
  })

  it('Gets info about allEpisodes', async () => {
    const query = `{ allEpisodes { info { count } } }`
    const { allEpisodes: { info } } = await test(query)

    expect(info).to.be.an('object')
  })

  it('Shows the full info section', async () => {
    const query = `{ allCharacters { info { count pages next prev } } }`
    const { allCharacters: { info } } = await test(query)

    expect(Object.keys(info)).to.deep.equal(keys)
    expect(info.count).to.be.an("number")
    expect(info.pages).to.be.an("number")
    expect(info.next).to.be.an("number")
    expect(info.prev).to.be.null
  })

  it('Gets the next page ', async () => {
    const query = `{ allCharacters(page: 2) { info { count pages next prev } } }`
    const { allCharacters: { info } } = await test(query)

    expect(info.prev).to.be.an("number")
  })
})
