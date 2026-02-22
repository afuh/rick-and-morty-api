import { describe, test, expect } from 'vitest'
import app from '../../app.js'

describe('CORS', () => {
  test('should handle CORS preflight for REST API', async () => {
    const res = await app.request('/api', { method: 'OPTIONS' })
    expect(res.status).toBe(204)
    expect(res.headers.get('access-control-allow-origin')).toBe('*')
  })

  test('should include CORS header on REST GET', async () => {
    const res = await app.request('/api')
    expect(res.headers.get('access-control-allow-origin')).toBe('*')
  })

  test('should handle CORS preflight for GraphQL', async () => {
    const res = await app.request('/graphql', { method: 'OPTIONS' })
    expect(res.status).toBe(204)
    expect(res.headers.get('access-control-allow-origin')).toBe('*')
  })
})

describe('Error Handling', () => {
  test('should return 404 for non-existent route', async () => {
    const res = await app.request('/error')
    expect(res.status).toBe(404)
  })
})

describe('Avatars', () => {
  test('should serve character avatar image', async () => {
    const res = await app.request('/api/character/avatar/1.jpeg')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/jpeg')
  })

  test('should return 400 for avatar root', async () => {
    const res = await app.request('/api/character/avatar')
    expect(res.status).toBe(400)

    const body = await res.json()
    expect(body).toHaveProperty('error')
  })
})
