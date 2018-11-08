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

const locFragment = query => (
  `
  ${query}
    fragment allProperties on Location {
      id
      name
      type
      dimension
      residents { id }
      created
    }
  `
)

const keys = ['id', 'name', 'type', 'dimension', 'residents', 'created']

const result = {
  location: 'Earth (C-137)',
  character: 'Beth Smith'
}

describe('Graphql: Location type (Query location(id))', () => {
  it('Gets a location by ID', async () => {
    const query = '{ location(id: 1) { name } }'
    const { location } = await test(query)

    expect(location).to.be.an('array')
    expect(location[0].name).to.equal(result.location)
  })

  it('Gets two locations by ID', async () => {
    const query = '{ location(id: [1, 2]) { name } }'
    const { location } = await test(query)

    expect(location[0].name).to.equal(result.location)
    expect(location[1].name).to.equal('Abadango')
  })

  it('Gets a Charcter type', async () => {
    const query = '{ location(id: 1) { residents { name } } }'
    const { location } = await test(query)

    expect(location[0].residents).to.be.an('array')
    expect(location[0].residents[0].name).to.equal(result.character)
  })

  it('Gets all properties', async () => {
    const query = locFragment(`{ location(id: 1) { ...allProperties } }`)
    const { location } = await test(query)

    expect(Object.keys(location[0])).to.deep.equal(keys)
  })
})

describe('Graphql: Location type (Query allLocations)', () => {
  it('Gets multiple locations', async () => {
    const query = `{ allLocations { results { name } } }`
    const { allLocations: { results } } = await test(query)

    expect(results).to.be.an('array')
    expect(results[0].name).to.equal(result.location)
  })

  it('Gets a Character type', async () => {
    const query = `{ allLocations { results { residents { name } } } }`
    const { allLocations: { results } } = await test(query)

    expect(results[0].residents).to.be.an('array')
    expect(results[0].residents[0].name).to.equal(result.character)
  })

  it('Gets all properties', async () => {
    const query = locFragment(`{ allLocations { results { ...allProperties } } }`)
    const { allLocations: { results } } = await test(query)

    expect(Object.keys(results[0])).to.deep.equal(keys)
  })
})

describe('Graphql: Location type (Query allLocations(filter))', () => {
  it('Filters a location by name', async () => {
    const query = `{ allLocations(filter: { name: "earth" }) { results { name } } }`
    const { allLocations: { results } } = await test(query)

    expect(results).to.deep.include({ name: result.location })
  })

  it('Filters an episode by episode code', async () => {
    const query = `{ allLocations(filter: { type: "planet" }) { results { type } } }`
    const { allLocations: { results } } = await test(query)

    expect(results).to.deep.include({ type: 'Planet' })
  })

  it('Filters a character by using more than one filter', async () => {
    const query = `{ allLocations(filter: { name: "earth" type: "planet" }) { results { name type } } }`
    const { allLocations: { results } } = await test(query)

    expect(results).to.deep.include({ name: result.location, type: 'Planet' })
  })
})
