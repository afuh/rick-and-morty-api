import { describe, test, expect } from 'vitest'
import app from '../../index.js'

const query = async (gql: string) => {
  const res = await app.request('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: gql }),
  })

  const json = await res.json()
  return json.data
}

const locFragment = (q: string) =>
  `
  ${q}
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

describe('GraphQL location(id)', () => {
  test('should get location by id', async () => {
    const gql = '{ location(id: 1) { name } }'
    const { location } = await query(gql)

    expect(location).toBeTypeOf('object')
    expect(location.name).toBe(result.location)
  })

  test('should get different location', async () => {
    const gql = '{ location(id: 2) { name } }'
    const { location } = await query(gql)

    expect(location).toBeTypeOf('object')
    expect(location.name).toBe('Abadango')
  })

  test('should get character type', async () => {
    const gql = '{ location(id: 1) { residents { name } } }'
    const { location } = await query(gql)

    expect(location.residents).toBeInstanceOf(Array)
    expect(location.residents).toHaveLength(27)
    expect(location.residents[0].name).toBe(result.character)
  })

  test('should get all properties', async () => {
    const gql = locFragment('{ location(id: 1) { ...allProperties } }')
    const { location } = await query(gql)

    expect(Object.keys(location)).toEqual(keys)
  })

  test('should return null for non-existent location', async () => {
    const gql = '{ location(id: 9999999) { id } }'
    const { location } = await query(gql)

    expect(location).toBeNull()
  })
})

describe('GraphQL locationsByIds(ids)', () => {
  test('should get one location by ids', async () => {
    const gql = '{ locationsByIds(ids: [1]) { name } }'
    const { locationsByIds } = await query(gql)

    expect(locationsByIds).toBeInstanceOf(Array)
    expect(locationsByIds[0].name).toBe(result.location)
  })

  test('should get multiple locations by ids', async () => {
    const gql = '{ locationsByIds(ids: [1, 2]) { name } }'
    const { locationsByIds } = await query(gql)

    expect(locationsByIds).toBeInstanceOf(Array)
    expect(locationsByIds).toEqual([{ name: 'Earth (C-137)' }, { name: 'Abadango' }])
  })

  test('should get five locations by ids', async () => {
    const gql = `{ locationsByIds(ids: [1, 2, 3, 4, 5]) { id } }`
    const { locationsByIds } = await query(gql)

    expect(locationsByIds).toBeInstanceOf(Array)
    expect(locationsByIds).toHaveLength(5)
  })

  test('should return empty array for non-existent ids', async () => {
    const gql = '{ locationsByIds(ids: [9999999]) { id } }'
    const { locationsByIds } = await query(gql)

    expect(locationsByIds).toBeInstanceOf(Array)
    expect(locationsByIds).toHaveLength(0)
  })
})

describe('GraphQL locations', () => {
  test('should get multiple locations', async () => {
    const gql = '{ locations { results { name } } }'
    const {
      locations: { results },
    } = await query(gql)

    expect(results).toBeInstanceOf(Array)
    expect(results[0].name).toBe(result.location)
  })

  test('should get character type', async () => {
    const gql = '{ locations { results { residents { name } } } }'
    const {
      locations: { results },
    } = await query(gql)

    expect(results[0].residents).toBeInstanceOf(Array)
    expect(results[0].residents[0].name).toBe(result.character)
  })

  test('should get all properties', async () => {
    const gql = locFragment('{ locations { results { ...allProperties } } }')
    const {
      locations: { results },
    } = await query(gql)

    expect(Object.keys(results[0])).toEqual(keys)
  })
})

describe('GraphQL locations(filter)', () => {
  test('should filter by name', async () => {
    const gql = '{ locations(filter: { name: "earth" }) { results { name } } }'
    const {
      locations: { results },
    } = await query(gql)

    expect(results).toContainEqual({ name: result.location })
  })

  test('should filter by type', async () => {
    const gql = '{ locations(filter: { type: "planet" }) { results { type } } }'
    const {
      locations: { results },
    } = await query(gql)

    expect(results).toContainEqual({ type: 'Planet' })
  })

  test('should filter by multiple properties', async () => {
    const gql = '{ locations(filter: { name: "earth" type: "planet" }) { results { name type } } }'
    const {
      locations: { results },
    } = await query(gql)

    expect(results).toContainEqual({ name: result.location, type: 'Planet' })
  })

  test('should return empty array for non-existent filter', async () => {
    const gql = '{ locations(filter: { name: "asdasdasd" }) { results { id } } }'
    const {
      locations: { results },
    } = await query(gql)

    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(0)
  })
})
