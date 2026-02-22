import { describe, test, expect } from 'vitest'
import { parse, validate, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import { depthLimit } from './depthLimit.js'

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    level1: {
      type: new GraphQLObjectType({
        name: 'Level1',
        fields: {
          level2: {
            type: new GraphQLObjectType({
              name: 'Level2',
              fields: {
                level3: { type: GraphQLString },
              },
            }),
          },
        },
      }),
    },
  },
})

const schema = new GraphQLSchema({ query: QueryType })

describe('depthLimit', () => {
  test('allows query within max depth', () => {
    const query = parse(`
      {
        level1 {
          level2 {
            level3
          }
        }
      }
    `)

    const errors = validate(schema, query, [depthLimit(3)])

    expect(errors).toHaveLength(0)
  })

  test('rejects query exceeding max depth', () => {
    const query = parse(`
      {
        level1 {
          level2 {
            level3
          }
        }
      }
    `)

    const errors = validate(schema, query, [depthLimit(2)])

    expect(errors).toHaveLength(1)
    expect(errors[0].message).toMatch(/Query depth limit of 2 exceeded/)
  })

  test('rejects deeply nested query', () => {
    const query = parse(`
      {
        level1 {
          level2 {
            level3
          }
        }
      }
    `)

    const errors = validate(schema, query, [depthLimit(1)])

    expect(errors).toHaveLength(1)
    expect(errors[0].message).toMatch(/exceeded/)
  })

  test('passes shallow query', () => {
    const query = parse(`
      {
        level1 {
          level2
        }
      }
    `)

    const errors = validate(schema, query, [depthLimit(2)])
    expect(errors).toHaveLength(0)
  })
})
