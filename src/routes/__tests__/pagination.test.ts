import { describe, test, expect } from 'vitest'
import app from '../../app.js'
import { message } from '../../config.js'

const resources = ['/api/character', '/api/location', '/api/episode']

describe.each(resources)('Pagination %s', (endpoint) => {
  test('should get all characters with pagination', async () => {
    const res = await app.request(endpoint)
    const body = await res.json()

    expect(body).toHaveProperty('info')
    expect(body).toHaveProperty('results')
    expect(body.results).toHaveLength(20)
  })

  test('should have valid pagination info', async () => {
    const res = await app.request(endpoint)
    const body = await res.json()

    expect(body.info).toHaveProperty('count')
    expect(body.info).toHaveProperty('pages')
    expect(body.info).toHaveProperty('next')
    expect(body.info).toHaveProperty('prev')
    expect(body.info.prev).toBeNull() // first page
  })

  test('should get first page', async () => {
    const res = await app.request(`${endpoint}?page=1`)
    const body = await res.json()

    expect(body.info.prev).toBeNull()
    expect(body.info.next.slice(-1)).toEqual('2')
    expect(body.results).toHaveLength(20)

    expect(body.results[0]).toMatchObject({ id: 1 })
    expect(body.results[19]).toMatchObject({ id: 20 })
  })

  test('should get last page', async () => {
    const res = await app.request(`${endpoint}?page=2`)
    const body = await res.json()

    expect(body.info.prev.slice(-1)).toEqual('1')
    expect(body.info.next).toBeNull()
    expect(body.results).toHaveLength(20)
  })

  test('should get an error message', async () => {
    const res = await app.request(`${endpoint}?page=12345`)

    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body).toBeInstanceOf(Object)
    expect(body).toHaveProperty('error')
    expect(body.error).toContain(message.noPage)
  })

  test('should keep query strings in pagination links', async () => {
    const res = await app.request(`${endpoint}?badParam=asdasd`)
    const body = await res.json()

    expect(body.info.next).not.toContain('badParam=asdasd')
    expect(body.info.prev).toBeNull()
  })

  test('should handle invalid page gracefully', async () => {
    const res = await app.request(`${endpoint}?page=abc`)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.info.prev).toBeNull()
  })
})
