import { describe, test, expect } from 'vitest'
import app from '../index.js'
import { message } from '../utils/helpers.js'

const keys = ['id', 'name', 'air_date', 'episode', 'characters', 'url', 'created']

describe('GET /api/episode', () => {
  test('should get all episodes with pagination', async () => {
    const res = await app.request('/api/episode')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toHaveProperty('info')
    expect(body).toHaveProperty('results')
    expect(body.results).toHaveLength(20)
  })

  test('should filter by name', async () => {
    const res = await app.request('/api/episode?name=Pilot')
    const body = await res.json()

    body.results.forEach((ep: any) => {
      expect(ep.name.toLowerCase()).toContain('pilot')
    })
  })

  test('should filter by episode code', async () => {
    const res = await app.request('/api/episode?episode=S01E01')
    const body = await res.json()

    body.results.forEach((ep: any) => {
      expect(ep.episode).toContain('S01E01')
    })
  })
})

describe('GET /api/episode/:id', () => {
  test('should get single episode by id', async () => {
    const res = await app.request('/api/episode/1')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toHaveProperty('id', 1)
    expect(Object.keys(body).sort()).toEqual(keys.sort())
  })

  test('should get multiple episodes with comma-separated ids', async () => {
    const res = await app.request('/api/episode/1,2,3')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(3)
  })

  test('should get multiple episodes with JSON array format', async () => {
    const res = await app.request('/api/episode/[1,2,3]')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(3)
  })

  test('should return 404 for non-existent episode', async () => {
    const res = await app.request('/api/episode/99999')
    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body).toHaveProperty('error', message.noEpisode)
  })

  test('should return 400 for invalid id', async () => {
    const res = await app.request('/api/episode/invalid')
    expect(res.status).toBe(400)

    const body = await res.json()
    expect(body).toHaveProperty('error', message.badParam)
  })
})
