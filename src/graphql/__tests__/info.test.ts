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

const keys = ['count', 'pages', 'next', 'prev']

describe('GraphQL pagination info', () => {
  test('should get info for characters', async () => {
    const gql = '{ characters { info { count } } }'
    const {
      characters: { info },
    } = await query(gql)

    expect(info).toBeTypeOf('object')
  })

  test('should get info for locations', async () => {
    const gql = '{ locations { info { count } } }'
    const {
      locations: { info },
    } = await query(gql)

    expect(info).toBeTypeOf('object')
  })

  test('should get info for episodes', async () => {
    const gql = '{ episodes { info { count } } }'
    const {
      episodes: { info },
    } = await query(gql)

    expect(info).toBeTypeOf('object')
  })

  test('should get full info section', async () => {
    const gql = '{ characters { info { count pages next prev } } }'
    const {
      characters: { info },
    } = await query(gql)

    expect(Object.keys(info)).toEqual(keys)
    expect(info.count).toBeTypeOf('number')
    expect(info.pages).toBeTypeOf('number')
    expect(info.next).toBeTypeOf('number')
    expect(info.prev).toBeNull()
  })

  test('should get next page info', async () => {
    const gql = '{ characters(page: 2) { info { count pages next prev } } }'
    const {
      characters: { info },
    } = await query(gql)

    expect(info.count).toBeTypeOf('number')
    expect(info.pages).toBeTypeOf('number')
    expect(info.next).toBeTypeOf('number')
    expect(info.prev).toBeTypeOf('number')
  })

  test('should return null info for invalid page', async () => {
    const gql = '{ characters(page: 2000) { info { count pages next prev } } }'
    const { characters } = await query(gql)

    expect(characters.info.count).toBeNull()
    expect(characters.info.pages).toBeNull()
    expect(characters.info.next).toBeNull()
    expect(characters.info.prev).toBeNull()
  })

  test('should return null info for invalid filter', async () => {
    const gql = '{ characters(filter: {name: "asdasdas"}) { info { count pages next prev } } }'
    const { characters } = await query(gql)

    expect(characters.info.count).toBeNull()
    expect(characters.info.pages).toBeNull()
    expect(characters.info.next).toBeNull()
    expect(characters.info.prev).toBeNull()
  })

  test.skip('should prevent deep nesting', async () => {
    // TODO: implement depth max limit.
    const gql = `
      {
      	characters {
          results {
            origin {
              residents {
                name
                origin {
                  name
                }
              }
            }
          }
        }
      }
    `
    const res = await app.request('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: gql }),
    })

    const json = await res.json()
    expect(json.errors).toBeDefined()
    expect(json.errors[0].message).toContain('Syntax Error')
  }, 10000)
})
