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

const epFragment = (query) =>
  `
  ${query}
    fragment allProperties on Episode {
      id
      name
      air_date
      episode
      characters {id}
      created
    }
  `

const keys = ['id', 'name', 'air_date', 'episode', 'characters', 'created']

const result = {
  episode: 'Pilot',
  character: 'Rick Sanchez',
}

describe('[GraphQL][Episode] - episode(id)', () => {
  it('Gets an episode by ID', async () => {
    const query = '{ episode(id: 1) { name } }'
    const { episode } = await test(query)

    expect(episode).to.be.an('object')
    expect(episode.name).to.equal(result.episode)
  })

  it('Gets a different episode', async () => {
    const query = '{ episode(id: 2) { name } }'
    const { episode } = await test(query)

    expect(episode).to.be.an('object')
    expect(episode.name).to.equal('Lawnmower Dog')
  })

  it('Gets a Character type', async () => {
    const query = '{ episode(id: 1) { characters { name } } }'
    const { episode } = await test(query)

    expect(episode.characters).to.be.an('array')
    expect(episode.characters[0].name).to.equal(result.character)
  })

  it('Gets all properties', async () => {
    const query = epFragment('{ episode(id: 1) { ...allProperties } }')
    const { episode } = await test(query)

    expect(Object.keys(episode)).to.deep.equal(keys)
  })
})

describe('[GraphQL][Episode] - episodesByIds(ids)', () => {
  it('Gets one episode by Ids', async () => {
    const query = '{ episodesByIds(ids: [1]) { name } }'
    const { episodesByIds } = await test(query)

    expect(episodesByIds).to.be.an('array')
    expect(episodesByIds[0].name).to.equal(result.episode)
  })

  it('Gets multiple episode by Ids', async () => {
    const query = '{ episodesByIds(ids: [1, 2]) { name } }'
    const { episodesByIds } = await test(query)

    expect(episodesByIds).to.be.an('array')
    expect(episodesByIds).to.deep.equal([{ name: 'Pilot' }, { name: 'Lawnmower Dog' }])
  })

  it('Gets five episodes by Ids', async () => {
    const query = `{ episodesByIds(ids: [1, 2, 3, 4, 5]) { id } }`
    const { episodesByIds } = await test(query)

    expect(episodesByIds).to.be.an('array')
    expect(episodesByIds).to.have.lengthOf(5)
  })
})

describe('[GraphQL][Episode] - episodes', () => {
  it('Gets multiple episodes', async () => {
    const query = '{ episodes { results { name } } }'
    const {
      episodes: { results },
    } = await test(query)

    expect(results).to.be.an('array')
    expect(results[0].name).to.equal(result.episode)
  })

  it('Gets a Character type', async () => {
    const query = '{ episodes { results { characters { name } } } }'
    const {
      episodes: { results },
    } = await test(query)

    expect(results[0].characters).to.be.an('array')
    expect(results[0].characters[0].name).to.equal(result.character)
  })

  it('Gets all properties', async () => {
    const query = epFragment('{ episodes { results { ...allProperties } } }')
    const {
      episodes: { results },
    } = await test(query)

    expect(Object.keys(results[0])).to.deep.equal(keys)
  })
})

describe('[GraphQL][Episode] - episodes(filter)', () => {
  it('Filters a episode by name', async () => {
    const query = '{ episodes(filter: { name: "Pilot" }) { results { name } } }'
    const {
      episodes: { results },
    } = await test(query)

    expect(results).to.deep.include({ name: result.episode })
  })

  it('Filters an episode by episode code', async () => {
    const query = '{ episodes(filter: { episode: "s01e01" }) { results { episode } } }'
    const {
      episodes: { results },
    } = await test(query)

    expect(results).to.deep.include({ episode: 'S01E01' })
  })

  it('Filters a character by using more than one filter', async () => {
    const query = '{ episodes(filter: { name: "pilot" episode: "s01e01" }) { results { name episode } } }'
    const {
      episodes: { results },
    } = await test(query)

    expect(results).to.deep.include({ name: result.episode, episode: 'S01E01' })
  })
})
