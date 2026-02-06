import { describe, test, expect } from 'vitest'
import app from '../index.js'
import { message } from '../utils/helpers.js'

const keys = ['id', 'name', 'type', 'dimension', 'residents', 'url', 'created']

describe('GET /api/location', () => {
  test('should get all locations with pagination', async () => {
    const res = await app.request('/api/location')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toHaveProperty('info')
    expect(body).toHaveProperty('results')
    expect(body.results).toHaveLength(20)
  })

  test('should filter by name', async () => {
    const res = await app.request('/api/location?name=Earth')
    const body = await res.json()

    body.results.forEach((loc: any) => {
      expect(loc.name.toLowerCase()).toContain('earth')
    })
  })

  test('should filter by type', async () => {
    const res = await app.request('/api/location?type=Planet')
    const body = await res.json()

    body.results.forEach((loc: any) => {
      expect(loc.type.toLowerCase()).toContain('planet')
    })
  })

  test('should filter by dimension', async () => {
    const res = await app.request('/api/location?dimension=C-137')
    const body = await res.json()

    body.results.forEach((loc: any) => {
      expect(loc.dimension).toContain('C-137')
    })
  })
})

describe('GET /api/location/:id', () => {
  test('should get single location by id', async () => {
    const res = await app.request('/api/location/1')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toHaveProperty('id', 1)
    expect(Object.keys(body).sort()).toEqual(keys.sort())
  })

  test('should get multiple locations with comma-separated ids', async () => {
    const res = await app.request('/api/location/1,2,3')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(3)
  })

  test('should get multiple locations with JSON array format', async () => {
    const res = await app.request('/api/location/[1,2,3]')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(3)
  })

  test('should return 404 for non-existent location', async () => {
    const res = await app.request('/api/location/99999')
    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body).toHaveProperty('error', message.noLocation)
  })

  test('should return 400 for invalid id', async () => {
    const res = await app.request('/api/location/invalid')
    expect(res.status).toBe(400)

    const body = await res.json()
    expect(body).toHaveProperty('error', message.badParam)
  })
})
