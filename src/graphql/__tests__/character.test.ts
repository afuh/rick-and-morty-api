import { describe, test, expect } from 'vitest'
import { fetchGraphql } from './utils/fetchGraphql.js'

const keys = {
  query: 'id name status species type gender origin { id } location { id } image episode { id } created',
  properties: [
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
    'created',
  ],
}

const result = {
  episode: 'Pilot',
  location: 'Earth (C-137)',
  character: 'Rick Sanchez',
}

describe('GraphQL character(id)', () => {
  test('should get character by id', async () => {
    const gql = '{ character(id: 1) { name } }'
    const { character } = await fetchGraphql(gql)

    expect(character).toBeTypeOf('object')
    expect(character.name).toBe(result.character)
  })

  test('should get different character', async () => {
    const gql = '{ character(id: 2) { name } }'
    const { character } = await fetchGraphql(gql)

    expect(character).toBeTypeOf('object')
    expect(character.name).toBe('Morty Smith')
  })

  test('should get location type', async () => {
    const gql = '{ character(id: 1) { origin { name } } }'
    const { character } = await fetchGraphql(gql)

    expect(character.origin).toBeTypeOf('object')
    expect(character.origin.name).toBe(result.location)
  })

  test('should get episode type', async () => {
    const gql = '{ character(id: 1) { episode { name } } }'
    const { character } = await fetchGraphql(gql)

    expect(character.episode).toBeInstanceOf(Array)
    expect(character.episode[0].name).toBe(result.episode)
  })

  test("should get character's name as resident", async () => {
    const gql = '{ character(id: 1) { name location { residents { name }} } }'
    const { character } = await fetchGraphql(gql)

    const { name } = character

    expect(name).toBe(result.character)
    expect(character.location.residents).toHaveLength(9)
    expect(character.location.residents).toBeInstanceOf(Array)
    expect(character.location.residents).toContainEqual({ name })
  })

  test('should get all properties', async () => {
    const gql = `{ character(id: 1) { ${keys.query} } }`
    const { character } = await fetchGraphql(gql)

    expect(Object.keys(character)).toEqual(keys.properties)
  })

  test('should return null for non-existent character', async () => {
    const gql = '{ character(id: 9999999) { id } }'
    const { character } = await fetchGraphql(gql)

    expect(character).toBeNull()
  })

  test('should return origin and location as-is when name is unknown', async () => {
    const gql = '{ character(id: 36) { origin { name } location { name } } }'
    const { character } = await fetchGraphql(gql)
    expect(character.origin).toEqual({ name: 'unknown' })

    expect(character.location).toEqual({ name: 'unknown' })
  })
})

describe('GraphQL charactersByIds(ids)', () => {
  test('should get one character by ids', async () => {
    const gql = '{ charactersByIds(ids: [1]) { name } }'
    const { charactersByIds } = await fetchGraphql(gql)

    expect(charactersByIds).toBeInstanceOf(Array)
    expect(charactersByIds[0].name).toBe(result.character)
  })

  test('should get two characters by ids', async () => {
    const gql = '{ charactersByIds(ids: [1, 2]) { name } }'
    const { charactersByIds } = await fetchGraphql(gql)

    expect(charactersByIds).toBeInstanceOf(Array)
    expect(charactersByIds).toEqual([{ name: 'Rick Sanchez' }, { name: 'Morty Smith' }])
  })

  test('should get five characters by ids', async () => {
    const gql = `{ charactersByIds(ids: [1, 2, 3, 4, 5]) { id } }`
    const { charactersByIds } = await fetchGraphql(gql)

    expect(charactersByIds).toBeInstanceOf(Array)
    expect(charactersByIds).toHaveLength(5)
  })

  test('should return empty array for non-existent ids', async () => {
    const gql = '{ charactersByIds(ids: [9999999]) { id } }'
    const { charactersByIds } = await fetchGraphql(gql)

    expect(charactersByIds).toBeInstanceOf(Array)
    expect(charactersByIds).toHaveLength(0)
  })
})

describe('GraphQL characters', () => {
  test('should get 20 characters', async () => {
    const gql = '{ characters { results { name } } }'
    const {
      characters: { results },
    } = await fetchGraphql(gql)

    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(20)
  })

  test('should get multiple characters', async () => {
    const gql = '{ characters { results { name } } }'
    const {
      characters: { results },
    } = await fetchGraphql(gql)

    expect(results).toBeInstanceOf(Array)
    expect(results[0].name).toBe(result.character)
  })

  test('should get location type', async () => {
    const gql = '{ characters { results { origin { name } } } }'
    const {
      characters: { results },
    } = await fetchGraphql(gql)

    expect(results[0].origin).toBeTypeOf('object')
    expect(results[0].origin.name).toBe(result.location)
  })

  test('should get episode type', async () => {
    const gql = '{ characters { results { episode { name }  } } }'
    const {
      characters: { results },
    } = await fetchGraphql(gql)

    expect(results[0].episode).toBeInstanceOf(Array)
    expect(results[0].episode[0].name).toBe(result.episode)
  })

  test("should get character's name as resident", async () => {
    const gql = '{ characters { results { name location { residents { name }}  } } }'
    const {
      characters: { results },
    } = await fetchGraphql(gql)

    const [{ name }] = results

    expect(name).toBe(result.character)
    expect(results[0].location.residents).toHaveLength(9)
    expect(results[0].location.residents).toBeInstanceOf(Array)
    expect(results[0].location.residents).toContainEqual({ name })
  })

  test('should get all properties', async () => {
    const gql = `{ characters { results { ${keys.query} }} }`

    const {
      characters: { results },
    } = await fetchGraphql(gql)

    expect(Object.keys(results[0])).toEqual(keys.properties)
  })
})

describe('GraphQL characters(filter)', () => {
  test('should filter by name', async () => {
    const gql = '{ characters(filter: {name: "Rick Sanchez"}) { results { name } } }'
    const {
      characters: { results },
    } = await fetchGraphql(gql)

    expect(results).toContainEqual({ name: result.character })
  })

  test('should filter by status', async () => {
    const gql = '{ characters(filter: {status: "dead"}) { results { status } } }'
    const {
      characters: { results },
    } = await fetchGraphql(gql)

    expect(results).toContainEqual({ status: 'Dead' })
  })

  test('should filter by species', async () => {
    const gql = '{ characters(filter: {species: "Human"}) { results { species } } }'
    const {
      characters: { results },
    } = await fetchGraphql(gql)

    expect(results).toContainEqual({ species: 'Human' })
  })

  test('should filter by type', async () => {
    const gql = '{ characters(filter: {type: "Parasite"}) { results { type } } }'
    const {
      characters: { results },
    } = await fetchGraphql(gql)

    expect(results).toContainEqual({ type: 'Parasite' })
  })

  test('should filter by gender', async () => {
    const gql = '{ characters(filter: {gender: "female"}) { results { gender } } }'
    const {
      characters: { results },
    } = await fetchGraphql(gql)

    expect(results).toContainEqual({ gender: 'Female' })
  })

  test('should filter by multiple properties', async () => {
    const gql = '{ characters(filter: { name: "rick" status: "dead" }) { results { name status } } }'
    const {
      characters: { results },
    } = await fetchGraphql(gql)

    expect(results).toContainEqual({ name: 'Adjudicator Rick', status: 'Dead' })
  })

  test('should ignore filters with `null` values', async () => {
    const gql = '{ characters(filter: { name: null }) { results { name } } }'
    const {
      characters: { results },
    } = await fetchGraphql(gql)

    expect(results).toBeInstanceOf(Array)
    expect(results[0].name).toBe(result.character)
  })

  test('should return empty array for non-existent filter', async () => {
    const gql = '{ characters(filter: { name: "asdasdasd" }) { results { id } } }'
    const {
      characters: { results },
    } = await fetchGraphql(gql)

    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(0)
  })
})
