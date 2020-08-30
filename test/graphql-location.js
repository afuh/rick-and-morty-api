process.env.NODE_ENV = 'test'

const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

const test = async (query) => {
  const res = await chai.request(server).post('/graphql').set('content-type', 'application/json').send({ query })

  return res.body.data
}

const locFragment = (query) =>
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

const keys = ['id', 'name', 'type', 'dimension', 'residents', 'created']

const result = {
  location: 'Earth (C-137)',
  character: 'Beth Smith',
}

describe('[Graphql][Location] - location(id)', () => {
  it('Gets a location by ID', async () => {
    const query = '{ location(id: 1) { name } }'
    const { location } = await test(query)

    expect(location).to.be.an('object')
    expect(location.name).to.equal(result.location)
  })

  it('Gets a different location', async () => {
    const query = '{ location(id: 2) { name } }'
    const { location } = await test(query)

    expect(location).to.be.an('object')
    expect(location.name).to.equal('Abadango')
  })

  it('Gets a Character type', async () => {
    const query = '{ location(id: 1) { residents { name } } }'
    const { location } = await test(query)

    expect(location.residents).to.be.an('array')
    expect(location.residents[0].name).to.equal(result.character)
  })

  it('Gets all properties', async () => {
    const query = locFragment('{ location(id: 1) { ...allProperties } }')
    const { location } = await test(query)

    expect(Object.keys(location)).to.deep.equal(keys)
  })
})

describe('[Graphql][Location] - locationsByIds(ids)', () => {
  it('Gets one location by Ids', async () => {
    const query = '{ locationsByIds(ids: [1]) { name } }'
    const { locationsByIds } = await test(query)

    expect(locationsByIds).to.be.an('array')
    expect(locationsByIds[0].name).to.equal(result.location)
  })

  it('Gets multiple locations by Ids', async () => {
    const query = '{ locationsByIds(ids: [1, 2]) { name } }'
    const { locationsByIds } = await test(query)

    expect(locationsByIds).to.be.an('array')
    expect(locationsByIds).to.deep.equal([{ name: 'Earth (C-137)' }, { name: 'Abadango' }])
  })

  it('Gets five locations by Ids', async () => {
    const query = `{ locationsByIds(ids: [1, 2, 3, 4, 5]) { id } }`
    const { locationsByIds } = await test(query)

    expect(locationsByIds).to.be.an('array')
    expect(locationsByIds).to.have.lengthOf(5)
  })
})

describe('[Graphql][Location] - locations', () => {
  it('Gets multiple locations', async () => {
    const query = '{ locations { results { name } } }'
    const {
      locations: { results },
    } = await test(query)

    expect(results).to.be.an('array')
    expect(results[0].name).to.equal(result.location)
  })

  it('Gets a Character type', async () => {
    const query = '{ locations { results { residents { name } } } }'
    const {
      locations: { results },
    } = await test(query)

    expect(results[0].residents).to.be.an('array')
    expect(results[0].residents[0].name).to.equal(result.character)
  })

  it('Gets all properties', async () => {
    const query = locFragment('{ locations { results { ...allProperties } } }')
    const {
      locations: { results },
    } = await test(query)

    expect(Object.keys(results[0])).to.deep.equal(keys)
  })
})

describe('[Graphql][Location] - locations(filter)', () => {
  it('Filters a location by name', async () => {
    const query = '{ locations(filter: { name: "earth" }) { results { name } } }'
    const {
      locations: { results },
    } = await test(query)

    expect(results).to.deep.include({ name: result.location })
  })

  it('Filters an episode by episode code', async () => {
    const query = '{ locations(filter: { type: "planet" }) { results { type } } }'
    const {
      locations: { results },
    } = await test(query)

    expect(results).to.deep.include({ type: 'Planet' })
  })

  it('Filters a character by using more than one filter', async () => {
    const query = '{ locations(filter: { name: "earth" type: "planet" }) { results { name type } } }'
    const {
      locations: { results },
    } = await test(query)

    expect(results).to.deep.include({ name: result.location, type: 'Planet' })
  })
})
