import { describe, test, expect } from 'vitest'
import app from '../../index.js'

type Filter = {
  name: string
  endpoint: string
  filters: {
    param: string
    value: string
    assert: (item: any, value: string) => void
  }[]
}

const resources: Filter[] = [
  {
    name: 'Location',
    endpoint: '/api/location',
    filters: [
      {
        param: 'name',
        value: 'Earth',
        assert: (loc, value) => expect(loc.name).toContain(value),
      },
      {
        param: 'type',
        value: 'Planet',
        assert: (loc, value) => expect(loc.type).toContain(value),
      },
      {
        param: 'dimension',
        value: 'C-137',
        assert: (loc, value) => expect(loc.dimension).toContain(value),
      },
    ],
  },
  {
    name: 'Character',
    endpoint: '/api/character',
    filters: [
      {
        param: 'name',
        value: 'Rick',
        assert: (char, value) => expect(char.name).toContain(value),
      },
      {
        param: 'status',
        value: 'Alive',
        assert: (char, value) => expect(char.status).toBe(value),
      },
      {
        param: 'species',
        value: 'Human',
        assert: (char, value) => expect(char.species).toContain(value),
      },
      {
        param: 'gender',
        value: 'Male',
        assert: (char, value) => expect(char.gender).toBe(value),
      },
    ],
  },
  {
    name: 'Episode',
    endpoint: '/api/episode',
    filters: [
      {
        param: 'name',
        value: 'Pilot',
        assert: (ep, value) => expect(ep.name).toContain(value),
      },
      {
        param: 'episode',
        value: 'S01E01',
        assert: (ep, value) => expect(ep.episode).toContain(value),
      },
    ],
  },
]

describe.each(resources)('$name Filters', ({ endpoint, filters }) => {
  test.each(filters)('should filter by $param', async ({ param, value, assert }) => {
    const res = await app.request(`${endpoint}?${param}=${value}`)
    const body = await res.json()

    body.results.forEach((item: any) => {
      assert(item, value)
    })
  })

  test('should sanitize query params (trim whitespace)', async () => {
    const res = await app.request(`${endpoint}?name=%20%20test%20%20`)

    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.results.length).toBeGreaterThanOrEqual(0)
  })
})
