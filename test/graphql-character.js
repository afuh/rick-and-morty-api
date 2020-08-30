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

const charFragment = (query) =>
  `
  ${query}
    fragment allProperties on Character {
      id
      name
      status
      species
      type
      gender
      origin { id }
      location { id }
      image
      episode { id }
      created
    }
  `

const keys = ['id', 'name', 'status', 'species', 'type', 'gender', 'origin', 'location', 'image', 'episode', 'created']

const result = {
  episode: 'Pilot',
  location: 'Earth (C-137)',
  character: 'Rick Sanchez',
}

describe('[Graphql][Character] - character(id)', () => {
  it('Gets a character by ID', async () => {
    const query = '{ character(id: 1) { name } }'
    const { character } = await test(query)

    expect(character).to.be.an('object')
    expect(character.name).to.equal(result.character)
  })

  it('Gets a different character', async () => {
    const query = '{ character(id: 2) { name } }'
    const { character } = await test(query)

    expect(character).to.be.an('object')
    expect(character.name).to.equal('Morty Smith')
  })

  it('Gets a Location type', async () => {
    const query = '{ character(id: 1) { origin { name } } }'
    const { character } = await test(query)

    expect(character.origin).to.be.an('object')
    expect(character.origin.name).to.equal(result.location)
  })

  it('Gets an Episode type', async () => {
    const query = '{ character(id: 1) { episode { name } } }'
    const { character } = await test(query)

    expect(character.episode).to.be.an('array')
    expect(character.episode[0].name).to.equal(result.episode)
  })

  it("Gets a character's name as resident", async () => {
    const query = '{ character(id: 1) { name location { residents { name }} } }'
    const { character } = await test(query)

    const { name } = character

    expect(name).to.equal(result.character)
    expect(character.location.residents).to.be.an('array')
    expect(character.location.residents).to.deep.include({ name })
  })

  it('Gets all properties', async () => {
    const query = charFragment('{ character(id: 1) { ...allProperties } }')
    const { character } = await test(query)

    expect(Object.keys(character)).to.deep.equal(keys)
  })
})

describe('[Graphql][Character] - charactersByIds(ids)', () => {
  it('Gets one characters by Ids', async () => {
    const query = '{ charactersByIds(ids: [1]) { name } }'
    const { charactersByIds } = await test(query)

    expect(charactersByIds).to.be.an('array')
    expect(charactersByIds[0].name).to.equal(result.character)
  })

  it('Gets two characters by Ids', async () => {
    const query = '{ charactersByIds(ids: [1, 2]) { name } }'
    const { charactersByIds } = await test(query)

    expect(charactersByIds).to.be.an('array')
    expect(charactersByIds).to.deep.equal([{ name: 'Rick Sanchez' }, { name: 'Morty Smith' }])
  })

  it('Gets five characters by Ids', async () => {
    const query = `{ charactersByIds(ids: [1, 2, 3, 4, 5]) { id } }`
    const { charactersByIds } = await test(query)

    expect(charactersByIds).to.be.an('array')
    expect(charactersByIds).to.have.lengthOf(5)
  })
})

describe('[Graphql][Character] - characters', () => {
  it('Gets multiple characters', async () => {
    const query = '{ characters { results { name } } }'
    const {
      characters: { results },
    } = await test(query)

    expect(results).to.be.an('array')
    expect(results[0].name).to.equal(result.character)
  })

  it('Gets a Location type', async () => {
    const query = '{ characters { results { origin { name } } } }'
    const {
      characters: { results },
    } = await test(query)

    expect(results[0].origin).to.be.an('object')
    expect(results[0].origin.name).to.equal(result.location)
  })

  it('Gets a Episode type', async () => {
    const query = '{ characters { results { episode { name }  } } }'
    const {
      characters: { results },
    } = await test(query)

    expect(results[0].episode).to.be.an('array')
    expect(results[0].episode[0].name).to.equal(result.episode)
  })

  it("Gets a character's name as resident", async () => {
    const query = '{ characters { results { name location { residents { name }}  } } }'
    const {
      characters: { results },
    } = await test(query)

    const [{ name }] = results

    expect(name).to.equal(result.character)
    expect(results[0].location.residents).to.be.an('array')
    expect(results[0].location.residents).to.deep.include({ name })
  })

  it('Gets all properties', async () => {
    const query = charFragment('{ characters { results { ...allProperties }} }')
    const {
      characters: { results },
    } = await test(query)

    expect(Object.keys(results[0])).to.deep.equal(keys)
  })
})

describe('[Graphql][Character] - characters(filter)', () => {
  it('Filters a character by name', async () => {
    const query = '{ characters(filter: {name: "Rick Sanchez"}) { results { name } } }'
    const {
      characters: { results },
    } = await test(query)

    expect(results).to.deep.include({ name: result.character })
  })

  it('Filters a character by status', async () => {
    const query = '{ characters(filter: {status: "dead"}) { results { status } } }'
    const {
      characters: { results },
    } = await test(query)

    expect(results).to.deep.include({ status: 'Dead' })
  })

  it('Filters a character by species', async () => {
    const query = '{ characters(filter: {species: "Human"}) { results { species } } }'
    const {
      characters: { results },
    } = await test(query)

    expect(results).to.deep.include({ species: 'Human' })
  })

  it('Filters a character by type', async () => {
    const query = '{ characters(filter: {type: "Parasite"}) { results { type } } }'
    const {
      characters: { results },
    } = await test(query)

    expect(results).to.deep.include({ type: 'Parasite' })
  })

  it('Filters a character by gender', async () => {
    const query = '{ characters(filter: {gender: "female"}) { results { gender } } }'
    const {
      characters: { results },
    } = await test(query)

    expect(results).to.deep.include({ gender: 'Female' })
  })

  it('Filters a character by using more than one filter', async () => {
    const query = '{ characters(filter: { name: "rick" status: "dead" }) { results { name status } } }'
    const {
      characters: { results },
    } = await test(query)

    expect(results).to.deep.include({ name: 'Adjudicator Rick', status: 'Dead' })
  })
})
