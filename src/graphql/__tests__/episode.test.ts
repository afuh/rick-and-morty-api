import { describe, test, expect } from 'vitest'
import { fetchGraphql } from './utils/fetchGraphql.js'

const keys = {
  query: 'id name air_date episode characters { id } created',
  properties: ['id', 'name', 'air_date', 'episode', 'characters', 'created'],
}

const result = {
  episode: 'Pilot',
  character: 'Rick Sanchez',
}

describe('GraphQL episode(id)', () => {
  test('should get episode by id', async () => {
    const gql = '{ episode(id: 1) { name } }'
    const { episode } = await fetchGraphql(gql)

    expect(episode).toBeTypeOf('object')
    expect(episode.name).toBe(result.episode)
  })

  test('should get different episode', async () => {
    const gql = '{ episode(id: 2) { name } }'
    const { episode } = await fetchGraphql(gql)

    expect(episode).toBeTypeOf('object')
    expect(episode.name).toBe('Lawnmower Dog')
  })

  test('should get character type', async () => {
    const gql = '{ episode(id: 1) { characters { name } } }'
    const { episode } = await fetchGraphql(gql)

    expect(episode.characters).toBeInstanceOf(Array)
    expect(episode.characters).toHaveLength(4)
    expect(episode.characters[0].name).toBe(result.character)
  })

  test('should get all properties', async () => {
    const gql = `{ episode(id: 1) { ${keys.query} } }`
    const { episode } = await fetchGraphql(gql)

    expect(Object.keys(episode)).toEqual(keys.properties)
  })

  test('should return null for non-existent episode', async () => {
    const gql = '{ episode(id: 9999999) { id } }'
    const { episode } = await fetchGraphql(gql)

    expect(episode).toBeNull()
  })
})

describe('GraphQL episodesByIds(ids)', () => {
  test('should get one episode by ids', async () => {
    const gql = '{ episodesByIds(ids: [1]) { name } }'
    const { episodesByIds } = await fetchGraphql(gql)

    expect(episodesByIds).toBeInstanceOf(Array)
    expect(episodesByIds[0].name).toBe(result.episode)
  })

  test('should get multiple episodes by ids', async () => {
    const gql = '{ episodesByIds(ids: [1, 2]) { name } }'
    const { episodesByIds } = await fetchGraphql(gql)

    expect(episodesByIds).toBeInstanceOf(Array)
    expect(episodesByIds).toEqual([{ name: 'Pilot' }, { name: 'Lawnmower Dog' }])
  })

  test('should get five episodes by ids', async () => {
    const gql = `{ episodesByIds(ids: [1, 2, 3, 4, 5]) { id } }`
    const { episodesByIds } = await fetchGraphql(gql)

    expect(episodesByIds).toBeInstanceOf(Array)
    expect(episodesByIds).toHaveLength(5)
  })

  test('should return empty array for non-existent ids', async () => {
    const gql = '{ episodesByIds(ids: [9999999]) { id } }'
    const { episodesByIds } = await fetchGraphql(gql)

    expect(episodesByIds).toBeInstanceOf(Array)
    expect(episodesByIds).toHaveLength(0)
  })
})

describe('GraphQL episodes', () => {
  test('should get multiple episodes', async () => {
    const gql = '{ episodes { results { name } } }'
    const {
      episodes: { results },
    } = await fetchGraphql(gql)

    expect(results).toBeInstanceOf(Array)
    expect(results[0].name).toBe(result.episode)
  })

  test('should get character type', async () => {
    const gql = '{ episodes { results { characters { name } } } }'
    const {
      episodes: { results },
    } = await fetchGraphql(gql)

    expect(results[0].characters).toBeInstanceOf(Array)
    expect(results[0].characters[0].name).toBe(result.character)
  })

  test('should get all properties', async () => {
    const gql = `{ episodes { results { ${keys.query} } } }`
    const {
      episodes: { results },
    } = await fetchGraphql(gql)

    expect(Object.keys(results[0])).toEqual(keys.properties)
  })
})

describe('GraphQL episodes(filter)', () => {
  test('should filter by name', async () => {
    const gql = '{ episodes(filter: { name: "Pilot" }) { results { name } } }'
    const {
      episodes: { results },
    } = await fetchGraphql(gql)

    expect(results).toContainEqual({ name: result.episode })
  })

  test('should filter by episode code', async () => {
    const gql = '{ episodes(filter: { episode: "s01e01" }) { results { episode } } }'
    const {
      episodes: { results },
    } = await fetchGraphql(gql)

    expect(results).toContainEqual({ episode: 'S01E01' })
  })

  test('should filter by multiple properties', async () => {
    const gql = '{ episodes(filter: { name: "pilot" episode: "s01e01" }) { results { name episode } } }'
    const {
      episodes: { results },
    } = await fetchGraphql(gql)

    expect(results).toContainEqual({ name: result.episode, episode: 'S01E01' })
  })

  test('should return empty array for non-existent filter', async () => {
    const gql = '{ episodes(filter: { name: "asdasdasd" }) { results { id } } }'
    const {
      episodes: { results },
    } = await fetchGraphql(gql)

    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(0)
  })
})
