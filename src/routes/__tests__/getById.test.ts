import { describe, test, expect } from 'vitest'
import app from '../../app.js'
import { message } from '../../config.js'

const resources = [
  {
    name: 'Character',
    endpoint: '/api/character',
    notFoundMessage: message.noCharacter,
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
      'url',
      'created',
    ],
  },
  {
    name: 'Episode',
    endpoint: '/api/episode',
    notFoundMessage: message.noEpisode,
    properties: ['id', 'name', 'air_date', 'episode', 'characters', 'url', 'created'],
  },
  {
    name: 'Location',
    endpoint: '/api/location',
    notFoundMessage: message.noLocation,
    properties: ['id', 'name', 'type', 'dimension', 'residents', 'url', 'created'],
  },
]

describe.each(resources)('$name /:id', ({ endpoint, notFoundMessage, properties }) => {
  test('should get single resource by id', async () => {
    const res = await app.request(`${endpoint}/1`)
    const body = await res.json()

    expect(body).toHaveProperty('id', 1)
    expect(body).toHaveProperty('name')
    expect(Object.keys(body).sort()).toEqual(properties.sort())
  })

  test('should get multiple resources with comma-separated ids', async () => {
    const res = await app.request(`${endpoint}/1,2,3`)
    const body = await res.json()

    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(3)

    expect(body.map((r: any) => r.id)).toEqual([1, 2, 3])
  })

  test('should get multiple resources with JSON array format', async () => {
    const res = await app.request(`${endpoint}/[1,2,3]`)
    const body = await res.json()

    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(3)
  })

  test('should return 404 for non-existent resource', async () => {
    const res = await app.request(`${endpoint}/99999`)
    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body).toHaveProperty('error', notFoundMessage)
  })

  test('should return 400 for invalid id', async () => {
    const res = await app.request(`${endpoint}/asdasd`)
    expect(res.status).toBe(400)

    const body = await res.json()
    expect(body).toHaveProperty('error', message.badParam)
  })

  test.each(['99991,99992,99993', '[99991,99992,99993]'])(
    'should return 404 when comma-separated format returns empty results: %s',
    async (invalid) => {
      const res = await app.request(`${endpoint}/${invalid}`)
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body).toHaveProperty('error', notFoundMessage)
    }
  )

  test.each(['[1,2', '1,2]', '[1,asdasd]'])('should return 500 for malformed array: %s', async (invalid) => {
    const res = await app.request(`${endpoint}/${invalid}`)
    expect(res.status).toBe(500)

    const body = await res.json()
    expect(body).toHaveProperty('error', message.badArray)
  })
})
